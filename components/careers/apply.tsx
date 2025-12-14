import React, { useState } from 'react';
import { SendHorizonal, Upload, X } from 'lucide-react';
import { Textarea } from '../ui/textarea';
import { Input } from '../ui/input';
import MainButton from '../ui/mainButton';
import { positions } from '@/lib/careerData';
import { toast } from 'sonner';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { submitJobApplication } from '@/utils/form-actions';

interface ApplyProps {
  activeTab: string;
}

const formSchema = z.object({
  firstName: z.string().min(2, 'First name must be at least 2 characters'),
  lastName: z.string().min(2, 'Last name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  phone: z.string().min(10, 'Please enter a valid phone number'),
  position: z.string().min(1, 'Please select a position'),
  coverLetter: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

const Apply = ({ activeTab }: ApplyProps) => {
  const [fileName, setFileName] = useState<string>('');
  const [cvFile, setCvFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      position: positions[0] || '',
      coverLetter: '',
    },
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      
      const maxSize = 5 * 1024 * 1024;
      if (file.size > maxSize) {
        toast.error('File size must be less than 5MB');
        return;
      }

      const allowedTypes = [
        'application/pdf',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
      ];
      if (!allowedTypes.includes(file.type)) {
        toast.error('Please upload PDF, DOC, or DOCX files only');
        return;
      }

      setFileName(file.name);
      setCvFile(file);
      toast.success('File uploaded successfully');
    }
  };

  const handleRemoveFile = () => {
    setFileName('');
    setCvFile(null);
    const fileInput = document.getElementById('file-upload') as HTMLInputElement;
    if (fileInput) fileInput.value = '';
  };

const onSubmit = async (values: FormValues) => {
  if (!cvFile) {
    toast.error('Please upload your CV');
    return;
  }

  setIsSubmitting(true);

  try {
    const formData = new FormData();
    formData.append('firstName', values.firstName);
    formData.append('lastName', values.lastName);
    formData.append('email', values.email);
    formData.append('phone', values.phone);
    formData.append('position', values.position);
    if (values.coverLetter) {
      formData.append('coverLetter', values.coverLetter);
    }
    formData.append('cv', cvFile);

    // استخدم Server Action بدل getform
    const result = await submitJobApplication(formData);

    if (result?.error) {
      toast.error(result.error);
    } else if (result?.success) {
      toast.success('Application submitted successfully! Check your email for confirmation.');
      form.reset();
      handleRemoveFile();
    }
  } catch (error) {
    console.error('Application error:', error);
    toast.error('An unexpected error occurred. Please try again.');
  } finally {
    setIsSubmitting(false);
  }
};

  if (activeTab !== 'apply') return null;

  return (
    <div className="animate-fade-in">
      <h1 className="text-5xl font-bold text-main text-center mb-4">
        Apply Now
      </h1>
      <div className="w-20 h-1 bg-main mx-auto mb-12"></div>

      <div className="bg-white rounded-3xl p-12 shadow-xl max-w-3xl mx-auto">
        <p className="text-center text-gray-600 text-base mb-12">
          Interested in joining our team? Submit your application and our recruitment team will review your credentials and get back to you.
        </p>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="firstName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      First Name <span className="text-main">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-main focus:outline-none transition-colors bg-gray-50"
                        placeholder="Enter your first name"
                        disabled={isSubmitting}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="lastName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Last Name <span className="text-main">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-main focus:outline-none transition-colors bg-gray-50"
                        placeholder="Enter your last name"
                        disabled={isSubmitting}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Email Address <span className="text-main">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        type="email"
                        className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-main focus:outline-none transition-colors bg-gray-50"
                        placeholder="your.email@example.com"
                        disabled={isSubmitting}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Phone Number <span className="text-main">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        type="tel"
                        className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-main focus:outline-none transition-colors bg-gray-50"
                        placeholder="+962 XX XXX XXXX"
                        disabled={isSubmitting}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="position"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Position Applied For <span className="text-main">*</span>
                  </FormLabel>
                  <FormControl>
                    <select
                      {...field}
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-main focus:outline-none transition-colors bg-gray-50 text-gray-900"
                      disabled={isSubmitting}
                    >
                      {positions.map((position) => (
                        <option key={position} value={position}>
                          {position}
                        </option>
                      ))}
                    </select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="coverLetter"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Cover Letter</FormLabel>
                  <FormControl>
                    <Textarea
                      {...field}
                      rows={6}
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-main focus:outline-none transition-colors bg-gray-50 resize-none"
                      placeholder="Tell us why you want to join IBLAW..."
                      disabled={isSubmitting}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">
                Upload CV/Resume <span className="text-main">*</span>
              </label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-12 text-center hover:border-main transition-colors cursor-pointer bg-gray-50 relative">
                <input
                  type="file"
                  accept=".pdf,.doc,.docx"
                  onChange={handleFileChange}
                  className="hidden"
                  id="file-upload"
                  disabled={isSubmitting}
                />
                
                {!fileName ? (
                  <label htmlFor="file-upload" className="cursor-pointer flex flex-col items-center">
                    <div className="w-12 h-12 bg-main rounded-lg flex items-center justify-center mb-4">
                      <Upload className="w-6 h-6 text-white" />
                    </div>
                    <p className="text-gray-900 font-medium mb-1">
                      Click to upload or drag and drop
                    </p>
                    <p className="text-gray-500 text-sm">
                      PDF, DOC, DOCX (Max 5MB)
                    </p>
                  </label>
                ) : (
                  <div className="flex items-center justify-center gap-3">
                    <div className="flex items-center gap-2 bg-main/10 px-4 py-2 rounded-lg">
                      <Upload className="w-5 h-5 text-main" />
                      <span className="text-gray-900 font-medium">{fileName}</span>
                    </div>
                    <button
                      type="button"
                      onClick={handleRemoveFile}
                      className="p-2 hover:bg-red-50 rounded-lg transition-colors"
                      disabled={isSubmitting}
                    >
                      <X className="w-5 h-5 text-red-500" />
                    </button>
                  </div>
                )}
              </div>
            </div>

            <MainButton
              type="submit"
              disabled={isSubmitting}
              text={isSubmitting ? 'Submitting...' : 'Submit Application'}
              right={SendHorizonal}
              className="w-full"
              spanClass="font-bold text-lg"
            />
          </form>
        </Form>
      </div>
    </div>
  );
};

export default Apply;