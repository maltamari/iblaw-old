// components/dashboard/news-awards/news-award-form.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { createClient } from "@/utils/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { Save, Upload, X } from "lucide-react";
import Image from "next/image";

const formSchema = z.object({
  title: z.string().min(1, "Title is required"),
  excerpt: z.string().min(10, "Excerpt must be at least 10 characters"),
  category: z.enum(["News", "Award"]),
  date: z.string().min(1, "Date is required"),
  image_url: z.string().min(1, "Image is required"),
  content: z.string().optional(),
  published: z.boolean(),
});

type FormData = z.infer<typeof formSchema>;

interface Props {
  newsAward: any;
  isNew: boolean;
}

export function NewsAwardForm({ newsAward, isNew }: Props) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [imagePreview, setImagePreview] = useState<string>(
    newsAward?.image_url || ""
  );
  const router = useRouter();
  const supabase = createClient();

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: newsAward?.title || "",
      excerpt: newsAward?.excerpt || "",
      category: newsAward?.category || "News",
      date: newsAward?.date || new Date().toISOString().split("T")[0],
      image_url: newsAward?.image_url || "",
      content: newsAward?.content || "",
      published: newsAward?.published ?? true,
    },
  });

  // Cloudinary Upload Handler
  async function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith("image/")) {
      toast.error("Please upload an image file");
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image size must be less than 5MB");
      return;
    }

    setIsUploading(true);

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append(
        "upload_preset",
        process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || "iblaw_news"
      );
      formData.append("folder", "iblaw/news-awards");

      const response = await fetch(
        `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`,
        {
          method: "POST",
          body: formData,
        }
      );

      if (!response.ok) {
        throw new Error("Upload failed");
      }

      const data = await response.json();
      const imageUrl = data.secure_url;

      // Update form and preview
      form.setValue("image_url", imageUrl);
      setImagePreview(imageUrl);
      toast.success("Image uploaded successfully!");
    } catch (error) {
      console.error("Error uploading image:", error);
      toast.error("Failed to upload image. Please try again.");
    } finally {
      setIsUploading(false);
    }
  }

  async function onSubmit(data: FormData) {
    // Validate image URL before submitting
    if (!imagePreview) {
      toast.error("Please upload an image");
      return;
    }

    setIsSubmitting(true);

    try {
      // Use imagePreview as the final image_url
      const submitData = { ...data, image_url: imagePreview };

      if (isNew) {
        // Insert new
        const { error } = await supabase.from("news_awards").insert([submitData]);
        if (error) throw error;
        toast.success("News/Award created successfully!");
      } else {
        // Update existing - check if newsAward exists
        if (!newsAward?.id) {
          toast.error("Invalid news/award ID");
          return;
        }
        const { error } = await supabase
          .from("news_awards")
          .update(submitData)
          .eq("id", newsAward.id);
        if (error) throw error;
        toast.success("News/Award updated successfully!");
      }

      router.push("/dashboard/news-awards");
      router.refresh();
    } catch (error) {
      console.error("Error saving:", error);
      toast.error("Failed to save. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="bg-white rounded-2xl shadow-lg p-8">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          {/* Title */}
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  Title <span className="text-red-500">*</span>
                </FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    placeholder="Enter title"
                    disabled={isSubmitting}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Excerpt */}
          <FormField
            control={form.control}
            name="excerpt"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  Excerpt <span className="text-red-500">*</span>
                </FormLabel>
                <FormControl>
                  <Textarea
                    {...field}
                    placeholder="Brief description (shown on cards)"
                    rows={3}
                    disabled={isSubmitting}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Category & Date */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              control={form.control}
              name="category"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Category <span className="text-red-500">*</span>
                  </FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    value={field.value}
                    disabled={isSubmitting}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="News">News</SelectItem>
                      <SelectItem value="Award">Award</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="date"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Date <span className="text-red-500">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input {...field} type="date" disabled={isSubmitting} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Image Upload with Cloudinary */}
          <FormField
            control={form.control}
            name="image_url"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  Image <span className="text-red-500">*</span>
                </FormLabel>

                {/* Image Preview */}
                {imagePreview && (
                  <div className="relative w-full h-64 rounded-lg overflow-hidden border-2 border-gray-200 mb-4">
                    <Image
                      src={imagePreview}
                      alt="Preview"
                      fill
                      className="object-cover"
                    />
                    <Button
                      type="button"
                      size="icon"
                      variant="destructive"
                      className="absolute top-2 right-2"
                      onClick={() => {
                        setImagePreview("");
                        form.setValue("image_url", "");
                      }}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                )}

                {/* Upload Button */}
                <div className="flex gap-4">
                  <Button
                    type="button"
                    variant="outline"
                    disabled={isUploading || isSubmitting}
                    onClick={() =>
                      document.getElementById("image-upload")?.click()
                    }
                  >
                    {isUploading ? (
                      <>
                        <Upload className="mr-2 h-4 w-4 animate-pulse" />
                        Uploading...
                      </>
                    ) : (
                      <>
                        <Upload className="mr-2 h-4 w-4" />
                        Upload Image
                      </>
                    )}
                  </Button>

                  <input
                    id="image-upload"
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleImageUpload}
                    disabled={isUploading || isSubmitting}
                  />

                  <Input
                    {...field}
                    placeholder="Or paste image URL"
                    disabled={isSubmitting || isUploading}
                    className="flex-1"
                    value={imagePreview}
                    onChange={(e) => {
                      const newUrl = e.target.value;
                      setImagePreview(newUrl);
                      form.setValue("image_url", newUrl);
                    }}
                  />
                </div>

                <FormDescription>
                  Upload an image or paste a URL (max 5MB)
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Full Content (Optional) */}
          <FormField
            control={form.control}
            name="content"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Full Content (Optional)</FormLabel>
                <FormControl>
                  <Textarea
                    {...field}
                    placeholder="Full article content..."
                    rows={10}
                    disabled={isSubmitting}
                  />
                </FormControl>
                <FormDescription>
                  For future use if you want full article pages
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Published Switch */}
          <FormField
            control={form.control}
            name="published"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                <div className="space-y-0.5">
                  <FormLabel className="text-base">Published</FormLabel>
                  <FormDescription>
                    Make this visible on the website
                  </FormDescription>
                </div>
                <FormControl>
                  <Switch
                    checked={field.value}
                    onCheckedChange={field.onChange}
                    disabled={isSubmitting}
                  />
                </FormControl>
              </FormItem>
            )}
          />

          {/* Submit Button */}
          <Button
            type="submit"
            disabled={isSubmitting || isUploading}
            className="w-full bg-main hover:bg-main/90"
          >
            {isSubmitting ? (
              "Saving..."
            ) : (
              <>
                <Save className="mr-2 h-4 w-4" />
                {isNew ? "Create" : "Update"} News/Award
              </>
            )}
          </Button>
        </form>
      </Form>
    </div>
  );
}