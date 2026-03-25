// components/careers/apply.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { SendHorizontalIcon, Upload, X } from 'lucide-react';
import { Textarea } from '../ui/textarea';
import { Input } from '../ui/input';
import MainButton from '../ui/mainButton';
import { positions } from '@/lib/careerData';
import { toast } from 'sonner';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { submitJobApplication } from '@/utils/form-actions';
import { Label } from '../ui/label';

interface ApplyProps {
  activeTab: string;
  preSelectedPosition: string | null;
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

// Constants
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED_FILE_TYPES = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
const INPUT_CLASS = "w-full px-4 py-3.5 rounded-xl border border-gray-300 focus:border-main focus:ring-2 focus:ring-main/20 focus:outline-none transition-all bg-white hover:border-gray-400";

// ✅ File Upload Component Props Type
interface FileUploadProps {
  fileName: string;
  onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onRemove: () => void;
  disabled: boolean;
}

// File Upload Component
const FileUpload = ({ fileName, onFileChange, onRemove, disabled }: FileUploadProps) => (
  <div>
    <label className="block text-sm font-medium text-gray-900 mb-2">
      Upload CV/Resume <span className="text-main">*</span>
    </label>
    <div className="border-2 border-dashed border-gray-300 rounded-lg p-12 text-center hover:border-main transition-colors cursor-pointer bg-gray-50">
      <Input
        type="file"
        accept=".pdf,.doc,.docx"
        onChange={onFileChange}
        className="hidden"
        id="file-upload"
        disabled={disabled}
      />
      
      {!fileName ? (
        <Label htmlFor="file-upload" className="cursor-pointer flex flex-col items-center">
          <div className="w-12 h-12 bg-main rounded-lg flex items-center justify-center mb-4">
            <Upload className="w-6 h-6 text-white" />
          </div>
          <p className="text-gray-900 font-medium mb-1">Click to upload or drag and drop</p>
          <p className="text-gray-500 text-sm">PDF, DOC, DOCX (Max 5MB)</p>
        </Label>
      ) : (
        <div className="flex items-center justify-center gap-3">
          <div className="flex items-center gap-2 bg-main/10 px-4 py-2 rounded-lg">
            <Upload className="w-5 h-5 text-main" />
            <span className="text-gray-900 font-medium">{fileName}</span>
          </div>
          <button
            type="button"
            onClick={onRemove}
            className="p-2 hover:bg-red-50 rounded-lg transition-colors"
            disabled={disabled}
          >
            <X className="w-5 h-5 text-red-500" />
          </button>
        </div>
      )}
    </div>
  </div>
);

const Apply = ({ activeTab, preSelectedPosition }: ApplyProps) => {
  const [fileName, setFileName] = useState('');
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

  useEffect(() => {
    if (preSelectedPosition && positions.includes(preSelectedPosition)) {
      form.setValue('position', preSelectedPosition);
    }
  }, [preSelectedPosition, form]);

  const validateFile = (file: File): boolean => {
    if (file.size > MAX_FILE_SIZE) {
      toast.error('File size must be less than 5MB');
      return false;
    }
    if (!ALLOWED_FILE_TYPES.includes(file.type)) {
      toast.error('Please upload PDF, DOC, or DOCX files only');
      return false;
    }
    return true;
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (validateFile(file)) {
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
      Object.entries(values).forEach(([key, value]) => {
        if (value) formData.append(key, value);
      });
      formData.append('cv', cvFile);

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
    <div className="animate-fade-in" role="tabpanel" id="panel-apply">
      <h1 className="text-4xl md:text-5xl font-bold text-main text-center mb-4">Apply Now</h1>
      <div className="w-20 h-1 bg-main mx-auto mb-12"></div>

      <div className="bg-white rounded-3xl p-8 md:p-12 shadow-xl max-w-3xl mx-auto">
        {/* Info Section Inside Form */}
        <div className="mb-8 pb-8 border-b border-gray-200">
          <p className="text-gray-700 text-base leading-relaxed mb-4">
            Interested in joining our team? Interested candidates may email us their letter of interest along with the following required documents:
          </p>
          <ul className="space-y-2.5 mb-4">
            <li className="flex items-start gap-3 text-gray-600">
              <span className="text-main font-bold mt-0.5">•</span>
              <span>CV</span>
            </li>
            <li className="flex items-start gap-3 text-gray-600">
              <span className="text-main font-bold mt-0.5">•</span>
              <span>Law School or University Transcripts</span>
            </li>
            <li className="flex items-start gap-3 text-gray-600">
              <span className="text-main font-bold mt-0.5">•</span>
              <span>Two references, preferably from previous employers</span>
            </li>
            <li className="flex items-start gap-3 text-gray-600">
              <span className="text-main font-bold mt-0.5">•</span>
              <span>Arabic and English writing samples</span>
            </li>
          </ul>
          <p className="text-gray-600 text-sm">
            Submit your application and our recruitment team will review your credentials and get back to you.
          </p>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Name Fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {(['firstName', 'lastName'] as const).map((name) => (
                <FormField
                  key={name}
                  control={form.control}
                  name={name}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        {name === 'firstName' ? 'First Name' : 'Last Name'} <span className="text-main">*</span>
                      </FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          className={INPUT_CLASS}
                          placeholder={`Enter your ${name === 'firstName' ? 'first' : 'last'} name`}
                          disabled={isSubmitting}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              ))}
            </div>

            {/* Contact Fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email Address <span className="text-main">*</span></FormLabel>
                    <FormControl>
                      <Input 
                        {...field} 
                        type="email" 
                        className={INPUT_CLASS} 
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
                    <FormLabel>Phone Number <span className="text-main">*</span></FormLabel>
                    <FormControl>
                      <Input 
                        {...field} 
                        type="tel" 
                        className={INPUT_CLASS} 
                        placeholder="+962 XX XXX XXXX" 
                        disabled={isSubmitting} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Position */}
            <FormField
              control={form.control}
              name="position"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Position Applied For <span className="text-main">*</span></FormLabel>
                  <FormControl>
                    <select {...field} className={`${INPUT_CLASS} text-gray-900`} disabled={isSubmitting}>
                      {positions.map((position) => (
                        <option key={position} value={position}>{position}</option>
                      ))}
                    </select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Cover Letter */}
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
                      className={`${INPUT_CLASS} resize-none`}
                      placeholder="Tell us why you want to join IBLAW..."
                      disabled={isSubmitting}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* File Upload */}
            <FileUpload
              fileName={fileName}
              onFileChange={handleFileChange}
              onRemove={handleRemoveFile}
              disabled={isSubmitting}
            />

            {/* Submit Button */}
            <div className="pt-2">
              <MainButton
                type="submit"
                disabled={isSubmitting}
                text={isSubmitting ? 'Submitting...' : 'Submit Application'}
                right={SendHorizontalIcon}
                className="w-full"
                spanClass="font-bold text-lg"
              />
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default Apply;