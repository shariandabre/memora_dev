import React, { Fragment, useState } from 'react';
import {
  View,
  Image,
  Platform,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  ScrollView,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { Input } from '~/components/ui/input';
import { Text } from '~/components/ui/text';
import { Muted, Title } from './ui/typography';
import { Label } from './ui/label';
import { Checkbox } from './ui/checkbox';
import { Textarea } from './ui/textarea';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { getLinkPreview } from 'link-preview-js';
import { BottomSheetScrollView } from '@gorhom/bottom-sheet';
import { z } from 'zod';
import SetNotificationDialog from './SetNotificationDialog';
import { useSQLiteContext } from 'expo-sqlite';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { createTag, getAllTages } from '~/db/tags';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Plus } from '~/lib/icons/Plus';
import { getAllFolders, createFolder } from '~/db/folder';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from './ui/select';
import useStore from '~/store/store';
import { Idea } from '~/lib/types';
import { createIdea } from '~/db/ideas';
import { PortalHost } from '@rn-primitives/portal';

const ideaForm = z.object({
  link: z.string().url().nullable(),
  title: z.string().min(1, 'Title is required').max(200, 'Title too long'),
  description: z.string().max(1000, 'Description too long').nullable(),
  folder_id: z.string().min(1, 'Folder name is required'),
});

type formType = z.infer<typeof ideaForm>;
type FormErrors = {
  [K in keyof formType]?: string;
};

const CreateIdea = ({
  setSnapPoints,
}: {
  setSnapPoints: React.Dispatch<React.SetStateAction<string[]>>;
}) => {
  const [step, setStep] = React.useState(1);
  const [formData, setFormData] = React.useState<formType>({
    link: null,
    title: '',
    description: null,
    folder_id: '',
  });
  const { closeBottomSheet } = useStore();
  const [errors, setErrors] = React.useState<FormErrors>({});
  const [fetchFromLink, setFetchFromLink] = React.useState(false);
  const [addContent, setAddContent] = React.useState(false);
  const [notify, setNotification] = React.useState(false);
  const [notificationDialog, setNotificationDialog] = React.useState(false);
  const [newFolder, setNewFolder] = useState<string>('');
  const [addFolder, setAddFolder] = useState(false);
  const [notificationDetails, setNotificationDetails] = React.useState<{
    date: Date | null;
    recurrence: 'none' | 'daily' | 'weekly' | 'monthly' | 'yearly' | null;
  }>({
    recurrence: null,
    date: null,
  });
  const [image, setImage] = React.useState(null);
  const [isLoading, setIsLoading] = React.useState(false);
  const [selectedTags, setSelectedTags] = useState<Array<string>>([]);
  const [newTag, setNewTag] = useState<string>('');
  const [addTag, setAddTag] = useState(false);
  const queryClient = useQueryClient();
  const insets = useSafeAreaInsets();
  const contentInsets = {
    top: insets.top,
    bottom: insets.bottom,
    left: 12,
    right: 12,
  };

  const db = useSQLiteContext();
  //tags
  const { isLoading: tagsLoading, data: tagsData } = useQuery({
    queryFn: () => getAllTages(db),
    queryKey: ['allTags'],
  });
  const mutation = useMutation({
    mutationFn: (tag: string) => createTag(db, tag),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['allTags'] }),
    onError(error, variables, context) {
      console.log(error);
    },
  });

  //folders
  const { isLoading: folderLoading, data: folderData } = useQuery({
    queryFn: () => getAllFolders(db),
    queryKey: ['allFolders'],
  });

  const folderMutation = useMutation({
    mutationFn: (folder: string) => createFolder(db, folder),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['allFolders'] }),
  });

  //ideas
  const ideasMutation = useMutation({
    mutationFn: (idea: Idea) => createIdea(db, idea),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['recentIdeas'] }),
  });

  const handleTagSelection = (tagId: string) => {
    if (selectedTags.includes(tagId)) {
      setSelectedTags(selectedTags.filter((t) => t !== tagId));
    } else {
      setSelectedTags([...selectedTags, tagId]);
    }
  };

  React.useEffect(() => {
    (async () => {
      if (Platform.OS !== 'web') {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== 'granted') {
          Alert.alert(
            'Permission Required',
            'Sorry, we need camera roll permissions to make this work!'
          );
        }
      }
    })();
  }, []);

  React.useEffect(() => {
    const fetchLinkPreview = async () => {
      if (!fetchFromLink || !formData.link) return;
      try {
        setIsLoading(true);

        const preview = await getLinkPreview(formData.link, {
          timeout: 8000,
          headers: {
            'user-agent': 'googlebot',
          },
        });

        setFormData((prev) => ({
          ...prev,
          title: preview.title || prev.title,
          description: preview.description || prev.description,
        }));

        if ('images' in preview && preview.images?.[0] && !image) {
          setImage(preview.images[0]);
        }
      } catch (error) {
        console.error('Error fetching link preview:', error);
        Alert.alert('Error', 'Error fetching link preview. Please check the URL.');
      } finally {
        setIsLoading(false);
        setStep(step + 1);
        setSnapPoints(['90%', '90%', '90%']);
      }
    };

    fetchLinkPreview();
  }, [fetchFromLink]);

  const validateField = (field: keyof formType, value: any) => {
    try {
      // Create a partial schema for just this field
      const fieldSchema = z.object({ [field]: ideaForm.shape[field] });
      fieldSchema.parse({ [field]: value });
      setErrors((prev) => ({ ...prev, [field]: undefined }));
      return true;
    } catch (error) {
      if (error instanceof z.ZodError) {
        const fieldError = error.errors.find((e) => e.path[0] === field);
        if (fieldError) {
          setErrors((prev) => ({ ...prev, [field]: fieldError.message }));
        }
      }
      return false;
    }
  };

  const handleInputChange = (field: keyof formType) => (text: string) => {
    const value = text.trim() === '' && field !== 'title' && field !== 'folder_id' ? null : text;
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
    validateField(field, value);
    if (field === 'link') setFetchFromLink(false);
  };

  const pickImage = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        quality: 1,
      });

      if (!result.canceled) {
        setImage(result.assets[0].uri);
      }
    } catch (error) {
      console.error('Error picking image:', error);
      Alert.alert('Error', 'Error selecting image');
    }
  };

  const validateStep = (currentStep: number) => {
    let isValid = true;
    const newErrors: FormErrors = {};

    if (currentStep === 1) {
      // If link is provided, validate it
      if (formData.link) {
        try {
          z.string().url().parse(formData.link);
        } catch (error) {
          newErrors.link = 'Please enter a valid URL';
          isValid = false;
        }
      }
    } else if (currentStep === 2) {
      if (!formData.title || formData.title.trim() === '') {
        newErrors.title = 'Title is required';
        isValid = false;
      } else if (formData.title.length > 200) {
        newErrors.title = 'Title too long';
        isValid = false;
      }

      if (formData.description && formData.description.length > 1000) {
        newErrors.description = 'Description too long';
        isValid = false;
      }
    } else if (currentStep === 3) {
      if (!formData.folder_id || formData.folder_id.trim() === '') {
        newErrors.folder_id = 'Folder name is required';
        isValid = false;
      }
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async () => {
    try {
      ideaForm.parse(formData);

      const idea: Idea = {
        ...formData,
        notification:
          notificationDetails.recurrence && notificationDetails.date
            ? {
                recurrence: notificationDetails.recurrence,
                date: notificationDetails.date.getTime(),
              }
            : null,
        image: image,
        tags: selectedTags,
      };

      ideasMutation.mutate(idea);

      setFormData({
        link: null,
        title: '',
        description: null,
        folder_id: '',
      });
      setNotification(false);
      setNotificationDetails({ date: null, recurrence: null });
      setImage(null);
      setStep(1);
      Alert.alert('Success', 'Idea created successfully!');
      closeBottomSheet();
    } catch (error) {
      if (error instanceof z.ZodError) {
        const newErrors: FormErrors = {};
        error.errors.forEach((err) => {
          const field = err.path[0] as keyof formType;
          newErrors[field] = err.message;
        });
        setErrors(newErrors);
        if (newErrors.link) {
          setStep(1);
        } else if (newErrors.title || newErrors.description) {
          setStep(2);
        } else if (newErrors.folder_id) {
          setStep(3);
        }
      } else {
        console.error('Error creating idea:', error);
        Alert.alert('Error', 'Failed to create idea. Please try again.');
      }
    }
  };

  const nextStep = () => {
    if (step < 3) {
      if (step === 1 && isLoading) {
        return;
      }
      if (validateStep(step)) {
        setStep(step + 1);

        switch (step) {
          case 1:
            setSnapPoints(['90%', '90%', '90%']);
            break;
          case 2:
            setSnapPoints(['90%', '90%', '90%']);
            break;
        }
      }
    }
  };

  const prevStep = () => {
    if (step > 1) {
      setStep(step - 1);

      switch (step) {
        case 2:
          setSnapPoints(['90%', '90%', '90%']);
          break;
        case 3:
          setSnapPoints(['90%', '90%', '90%']);
          break;
      }
    }
  };

  const renderStepIndicator = () => (
    <View className="mb-4 flex flex-row justify-center gap-2 space-x-2">
      {[1, 2, 3].map((s) => (
        <View
          key={s}
          className={`h-2 w-8 rounded-full ${s === step ? 'bg-primary' : 'bg-muted'}`}
        />
      ))}
    </View>
  );

  const renderStep1 = () => (
    <View className="flex flex-col gap-4">
      <View className="flex flex-col gap-2">
        <View>
          <Label nativeID="link">Link</Label>
          <Input
            placeholder="Eg: https://example.com"
            value={formData.link || ''}
            id="link"
            onChangeText={handleInputChange('link')}
            aria-labelledby="link"
          />
          {errors.link && <Text className="mt-1 text-sm text-destructive">{errors.link}</Text>}
        </View>
        <View className="flex flex-row gap-2">
          <Checkbox checked={fetchFromLink} onCheckedChange={setFetchFromLink} />
          <Muted>Fetch details from link.</Muted>
        </View>
      </View>
    </View>
  );

  const renderStep2 = () => (
    <View className="flex flex-col gap-4">
      <View>
        <Label nativeID="title">
          Title<Text className="text-destructive"> *</Text>
        </Label>
        <Input
          placeholder="Eg: 20 project ideas."
          value={formData.title || ''}
          id="title"
          onChangeText={handleInputChange('title')}
          aria-labelledby="title"
        />
        {errors.title && <Text className="mt-1 text-sm text-destructive">{errors.title}</Text>}
      </View>

      <View>
        <Label nativeID="description">Description/Body</Label>
        <Textarea
          placeholder="Eg: Best 20 mini project ideas ..."
          value={formData.description || ''}
          onChangeText={handleInputChange('description')}
          numberOfLines={2}
          aria-labelledby="description"
        />
        {errors.description && (
          <Text className="mt-1 text-sm text-destructive">{errors.description}</Text>
        )}
      </View>
      <View>
        <Label nativeID="tags">Tags</Label>
        <ScrollView horizontal={true} className="flex w-full flex-row gap-2">
          {tagsData?.map((tag) => (
            <TouchableOpacity
              key={tag.id}
              onPress={() => handleTagSelection(tag.id)}
              className={`${selectedTags.includes(tag.id) ? 'bg-primary' : 'bg-background'} mx-1 rounded-2xl px-3 py-1 `}>
              <Text
                className={`${selectedTags.includes(tag.id) ? 'text-primary-foreground' : 'text-foreground'}`}>
                #{tag.name}
              </Text>
            </TouchableOpacity>
          ))}
          <TouchableOpacity
            onPress={() => setAddTag(true)}
            className={` mx-1 flex items-center justify-center rounded-2xl bg-background px-3 py-1 `}>
            <Plus size={16} className={`text-foreground`} />
          </TouchableOpacity>
        </ScrollView>
        {addTag && (
          <View className="mt-2 flex flex-row">
            <Input
              className="flex-1"
              placeholder="Add a new tag"
              value={newTag}
              onChangeText={setNewTag}
            />
            <Button
              variant={'outline'}
              onPress={() => {
                mutation.mutate(newTag);
                setNewTag('');
                setAddTag(false);
              }}
              className=" ml-2 bg-card">
              <Text>Add</Text>
            </Button>
          </View>
        )}
      </View>

      <View>
        <Label nativeID="img">Image</Label>
        <View className="mt-2">
          {image && (
            <TouchableOpacity onPress={pickImage} className="h-40 w-full">
              <Image source={{ uri: image }} className="mb-2 h-40 w-full rounded-lg object-cover" />
            </TouchableOpacity>
          )}

          {!image && (
            <TouchableOpacity onPress={pickImage} className="h-40 w-full">
              <Card className="mb-2 flex h-40 w-full items-center justify-center rounded-lg border-0 border-none bg-background p-0">
                <Text className={isLoading ? 'text-muted' : 'text-foreground'}>
                  {isLoading ? 'Fetching...' : 'Select Image'}
                </Text>
              </Card>
            </TouchableOpacity>
          )}
        </View>
      </View>

      <View className="flex flex-row gap-2">
        <Checkbox
          checked={notify}
          onCheckedChange={(notify) => {
            setNotification(notify);
            setNotificationDialog(notify);
          }}
        />
        <Muted>Set Notification.</Muted>
      </View>
    </View>
  );

  const renderStep3 = () => (
    <View className="flex flex-col gap-4">
      <View>
        <Label nativeID="folder">
          Folder<Text className="text-destructive"> *</Text>
        </Label>
        <Select
          onValueChange={(value) => {
            if (value) handleInputChange('folder_id')(value.value);
          }}>
          <SelectTrigger className="w-full">
            <SelectValue
              className="native:text-lg text-sm text-foreground"
              placeholder="Select folder"
            />
          </SelectTrigger>
          <SelectContent insets={contentInsets} className="w-full">
            <SelectGroup>
              <SelectLabel>Folders</SelectLabel>
              {folderData?.map((folder, idx) => (
                <SelectItem key={idx} label={folder.name} value={folder.id}>
                  {folder.name}
                </SelectItem>
              ))}
            </SelectGroup>
            <Button
              onPress={() => setAddFolder(true)}
              variant={'outline'}
              size={'icon'}
              className="w-full bg-card">
              <Plus size={16} className={`text-card-foreground`} />
            </Button>
          </SelectContent>
        </Select>
        {errors.folder_id && (
          <Text className="mt-1 text-sm text-destructive">{errors.folder_id}</Text>
        )}
        {addFolder && (
          <View className="mt-2 flex flex-row">
            <Input
              className="flex-1"
              placeholder="Create a new folder"
              value={newFolder}
              onChangeText={setNewFolder}
            />
            <Button
              variant={'outline'}
              onPress={() => {
                folderMutation.mutate(newFolder);
                setNewFolder('');
                setAddFolder(false);
              }}
              className=" ml-2 bg-card">
              <Text>Add</Text>
            </Button>
          </View>
        )}
      </View>

      <View className="flex flex-row gap-2">
        <Checkbox checked={addContent} onCheckedChange={setAddContent} />
        <Muted>Add content.</Muted>
      </View>
    </View>
  );

  return (
    <BottomSheetScrollView
      style={{ flex: 1, width: '100%', maxWidth: 768 }}
      className="flex w-full flex-1  ">
      <Title className="mb-5">Start Creating Now</Title>
      {renderStepIndicator()}

      {step === 1 && renderStep1()}
      {step === 2 && renderStep2()}
      {step === 3 && renderStep3()}

      <View className="mt-4 flex flex-row justify-between">
        {step > 1 && (
          <Button
            variant="ghost"
            className={step === 1 ? 'flex w-full flex-row gap-2' : ''}
            onPress={prevStep}>
            <Text>Previous</Text>
          </Button>
        )}

        {step < 3 ? (
          <Button
            variant="default"
            disabled={isLoading}
            onPress={nextStep}
            className={step === 1 ? 'flex w-full flex-row gap-2' : ''}>
            {!isLoading ? <Text>Next</Text> : <ActivityIndicator size={16} color={'black'} />}
          </Button>
        ) : (
          <Button onPress={handleSubmit} variant="default">
            <Text>Create</Text>
          </Button>
        )}
      </View>
      <SetNotificationDialog
        onSave={(date, recurrence) =>
          setNotificationDetails({ date: date, recurrence: recurrence })
        }
        isOpen={notificationDialog}
        onClose={setNotificationDialog}
      />
    </BottomSheetScrollView>
  );
};

export default CreateIdea;
