"use client";

import { useState, useTransition, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Loader2, Upload, X, FileDown, FileText } from "lucide-react";
import { TeamCategory, TeamMember } from "@/utils/team-actions";
import { uploadToCloudinary, deleteFromCloudinary, uploadVCardToCloudinary, uploadPDFToCloudinary } from "@/utils/cloudinary-upload";
import { toast } from "sonner";
import Image from "next/image";

type TeamMemberFormProps = {
    initialData?: TeamMember;
    onSubmit: (formData: FormData) => Promise<{ error?: string; success?: boolean; slug?: string }>;
    submitLabel: string;
    onCancel: () => void;
};

// ✅ Validation helpers
const validateEmail = (email: string): boolean => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email) && email.length <= 254;
};

const validatePhone = (phone: string): boolean => {
    const regex = /^[+]?[(]?[0-9]{1,4}[)]?[-\s.]?[(]?[0-9]{1,4}[)]?[-\s.]?[0-9]{1,9}$/;
    return regex.test(phone) && phone.length >= 7 && phone.length <= 20;
};

const validateName = (name: string): boolean => {
    return name.trim().length >= 2 && name.trim().length <= 100;
};

const validateYear = (year: number): boolean => {
    return year >= 1;
};

export function TeamMemberForm({ initialData, onSubmit, submitLabel, onCancel }: TeamMemberFormProps) {
    const [isPending, startTransition] = useTransition();
    const [category, setCategory] = useState<TeamCategory>(initialData?.category || "partner");
    
    // ✅ Form validation errors
    const [errors, setErrors] = useState<Record<string, string>>({});

    // Photo states
    const [photoUrl, setPhotoUrl] = useState(initialData?.photo_url || "");
    const [photoPublicId, setPhotoPublicId] = useState("");
    const [isUploadingPhoto, setIsUploadingPhoto] = useState(false);
    const photoInputRef = useRef<HTMLInputElement>(null);

    // vCard states
    const [vcardUrl, setVcardUrl] = useState(initialData?.vcard_url || "");
    const [vcardPublicId, setVcardPublicId] = useState("");
    const [isUploadingVcard, setIsUploadingVcard] = useState(false);
    const vcardInputRef = useRef<HTMLInputElement>(null);

    // PDF states
    const [pdfUrl, setPdfUrl] = useState(initialData?.bio_pdf_url || "");
    const [pdfPublicId, setPdfPublicId] = useState("");
    const [isUploadingPdf, setIsUploadingPdf] = useState(false);
    const pdfInputRef = useRef<HTMLInputElement>(null);

    // ✅ Handle Photo Upload with validation
    const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // ✅ Validate file type
        if (!file.type.startsWith('image/')) {
            toast.error('Please select an image file (JPG, PNG, WebP)');
            if (photoInputRef.current) photoInputRef.current.value = '';
            return;
        }

        // ✅ Validate file size (10MB)
        const maxSize = 10 * 1024 * 1024;
        if (file.size > maxSize) {
            toast.error('Image size must be less than 10MB');
            if (photoInputRef.current) photoInputRef.current.value = '';
            return;
        }

        setIsUploadingPhoto(true);
        const toastId = toast.loading('Uploading photo...', { duration: Infinity });

        try {
            const result = await uploadToCloudinary(file);

            toast.dismiss(toastId);
            setIsUploadingPhoto(false);

            if (result.error) {
                toast.error(result.error);
            } else {
                setPhotoUrl(result.url!);
                setPhotoPublicId(result.publicId!);
                toast.success('Photo uploaded successfully!');
            }
        } catch (error) {
            toast.dismiss(toastId);
            setIsUploadingPhoto(false);
            toast.error('Failed to upload photo. Please try again.');
            console.error('Photo upload error:', error);
        }
    };

    // ✅ Handle vCard Upload with validation
    const handleVcardUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // ✅ Validate file extension
        if (!file.name.toLowerCase().endsWith('.vcf')) {
            toast.error('Please select a vCard file (.vcf)');
            if (vcardInputRef.current) vcardInputRef.current.value = '';
            return;
        }

        // ✅ Validate file size (1MB)
        const maxSize = 1024 * 1024;
        if (file.size > maxSize) {
            toast.error('vCard file must be less than 1MB');
            if (vcardInputRef.current) vcardInputRef.current.value = '';
            return;
        }

        setIsUploadingVcard(true);
        const toastId = toast.loading('Uploading vCard...', { duration: Infinity });

        try {
            const result = await uploadVCardToCloudinary(file);

            toast.dismiss(toastId);
            setIsUploadingVcard(false);

            if (result.error) {
                toast.error(result.error);
            } else {
                setVcardUrl(result.url!);
                setVcardPublicId(result.publicId!);
                toast.success('vCard uploaded successfully!');
            }
        } catch (error) {
            toast.dismiss(toastId);
            setIsUploadingVcard(false);
            toast.error('Failed to upload vCard. Please try again.');
            console.error('vCard upload error:', error);
        }
    };

    // ✅ Handle PDF Upload with validation
    const handlePdfUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // ✅ Validate file type
        if (file.type !== 'application/pdf') {
            toast.error('Please select a PDF file');
            if (pdfInputRef.current) pdfInputRef.current.value = '';
            return;
        }

        // ✅ Validate file size (5MB)
        const maxSize = 5 * 1024 * 1024;
        if (file.size > maxSize) {
            toast.error('PDF file must be less than 5MB');
            if (pdfInputRef.current) pdfInputRef.current.value = '';
            return;
        }

        setIsUploadingPdf(true);
        const toastId = toast.loading('Uploading PDF...', { duration: Infinity });

        try {
            const result = await uploadPDFToCloudinary(file);

            toast.dismiss(toastId);
            setIsUploadingPdf(false);

            if (result.error) {
                toast.error(result.error);
            } else {
                setPdfUrl(result.url!);
                setPdfPublicId(result.publicId!);
                toast.success('PDF uploaded successfully!');
            }
        } catch (error) {
            toast.dismiss(toastId);
            setIsUploadingPdf(false);
            toast.error('Failed to upload PDF. Please try again.');
            console.error('PDF upload error:', error);
        }
    };

    // ✅ Remove handlers with cleanup
    const handleRemovePhoto = async () => {
        try {
            if (photoPublicId) {
                await deleteFromCloudinary(photoPublicId);
            }
            setPhotoUrl("");
            setPhotoPublicId("");
            if (photoInputRef.current) photoInputRef.current.value = "";
            toast.success('Photo removed');
        } catch (error) {
            console.error('Error removing photo:', error);
            toast.error('Failed to remove photo');
        }
    };

    const handleRemoveVcard = async () => {
        try {
            if (vcardPublicId) {
                await deleteFromCloudinary(vcardPublicId);
            }
            setVcardUrl("");
            setVcardPublicId("");
            if (vcardInputRef.current) vcardInputRef.current.value = "";
            toast.success('vCard removed');
        } catch (error) {
            console.error('Error removing vCard:', error);
            toast.error('Failed to remove vCard');
        }
    };

    const handleRemovePdf = async () => {
        try {
            if (pdfPublicId) {
                await deleteFromCloudinary(pdfPublicId);
            }
            setPdfUrl("");
            setPdfPublicId("");
            if (pdfInputRef.current) pdfInputRef.current.value = "";
            toast.success('PDF removed');
        } catch (error) {
            console.error('Error removing PDF:', error);
            toast.error('Failed to remove PDF');
        }
    };

    // ✅ Client-side validation before submit
    const validateForm = (formData: FormData): boolean => {
        const newErrors: Record<string, string> = {};

        // Name validation
        const name = formData.get("name") as string;
        if (!name || !validateName(name)) {
            newErrors.name = "Name must be 2-100 characters";
        }

        // Email validation (optional but if provided must be valid)
        const email = formData.get("email") as string;
        if (email && !validateEmail(email)) {
            newErrors.email = "Invalid email format";
        }

        // Phone validation (optional but if provided must be valid)
        const phone = formData.get("phone") as string;
        if (phone && !validatePhone(phone)) {
            newErrors.phone = "Invalid phone format";
        }

        // Oath year validation
        const oathYear = parseInt(formData.get("oath_year") as string);
        if (oathYear && !validateYear(oathYear)) {
            newErrors.oath_year = "Invalid year (1900-" + (new Date().getFullYear() + 10) + ")";
        }

        // Biography length check
        const biography = formData.get("biography") as string;
        if (biography && biography.length > 5000) {
            newErrors.biography = "Biography is too long (max 5000 characters)";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        
        const formData = new FormData(e.currentTarget);

        // ✅ Client-side validation
        if (!validateForm(formData)) {
            toast.error("Please fix the errors in the form");
            return;
        }

        // ✅ Add uploaded file URLs
        if (photoUrl) formData.set('photo_url', photoUrl);
        if (vcardUrl) formData.set('vcard_url', vcardUrl);
        if (pdfUrl) formData.set('bio_pdf_url', pdfUrl);

        startTransition(async () => {
            try {
                const result = await onSubmit(formData);

                if (result.error) {
                    toast.error(result.error);
                } else {
                    const successMessage = initialData 
                        ? "Team member updated successfully!" 
                        : "Team member added successfully!";
                    
                    toast.success(successMessage);
                    
                    // ✅ Reset form only if adding (not editing)
                    if (!initialData) {
                        (e.target as HTMLFormElement).reset();
                        setPhotoUrl("");
                        setPhotoPublicId("");
                        setVcardUrl("");
                        setVcardPublicId("");
                        setPdfUrl("");
                        setPdfPublicId("");
                        setCategory("partner");
                        setErrors({});
                    }
                    
                    onCancel(); // Close dialog
                }
            } catch (error) {
                console.error('Form submission error:', error);
                toast.error('An unexpected error occurred. Please try again.');
            }
        });
    };

    const isAnyUploading = isUploadingPhoto || isUploadingVcard || isUploadingPdf;
    const isFormDisabled = isPending || isAnyUploading;

    return (
        <form onSubmit={handleSubmit} noValidate>
            <div className="grid gap-6 py-4">
                {/* Basic Info */}
                <div className="space-y-4">
                    <h3 className="text-sm font-semibold text-gray-500 uppercase">Basic Information</h3>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="grid gap-2">
                            <Label htmlFor="name">
                                Name <span className="text-destructive">*</span>
                            </Label>
                            <Input
                                id="name"
                                name="name"
                                defaultValue={initialData?.name}
                                placeholder="John Doe"
                                required
                                disabled={isFormDisabled}
                                aria-invalid={!!errors.name}
                                aria-describedby={errors.name ? "name-error" : undefined}
                            />
                            {errors.name && (
                                <p id="name-error" className="text-xs text-destructive">
                                    {errors.name}
                                </p>
                            )}
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="slug">Slug (URL)</Label>
                            <Input
                                id="slug"
                                name="slug"
                                defaultValue={initialData?.slug}
                                placeholder="auto-generated-from-name"
                                disabled={isFormDisabled}
                            />
                            <p className="text-xs text-muted-foreground">
                                Leave empty to auto-generate
                            </p>
                        </div>
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="role">Role</Label>
                        <Input
                            id="role"
                            name="role"
                            defaultValue={initialData?.role}
                            placeholder="Senior Partner"
                            disabled={isFormDisabled}
                        />
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="department">Department</Label>
                        <Input
                            id="department"
                            name="department"
                            defaultValue={initialData?.department}
                            placeholder="Litigation"
                            disabled={isFormDisabled}
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="grid gap-2">
                            <Label htmlFor="category">
                                Category <span className="text-destructive">*</span>
                            </Label>
                            <Select
                                name="category"
                                value={category}
                                onValueChange={(value) => setCategory(value as TeamCategory)}
                                disabled={isFormDisabled}
                                required
                            >
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="partner">Partner</SelectItem>
                                    <SelectItem value="associate">Associate</SelectItem>
                                    <SelectItem value="management">Management</SelectItem>
                                    <SelectItem value="trainee">Trainee</SelectItem>
                                </SelectContent>
                            </Select>
                            <Input type="hidden" name="category" value={category} />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="oath_year">Order</Label>
                            <Input
                                id="oath_year"
                                name="oath_year"
                                type="number"
                                placeholder="0"
                                min="1"
                                max={new Date().getFullYear() + 10}
                                defaultValue={initialData?.oath_year || "0"}
                                disabled={isFormDisabled}
                                aria-invalid={!!errors.oath_year}
                                aria-describedby={errors.oath_year ? "oath-year-error" : undefined}
                            />
                            {errors.oath_year && (
                                <p id="oath-year-error" className="text-xs text-destructive">
                                    {errors.oath_year}
                                </p>
                            )}
                        </div>
                    </div>
                </div>

                {/* Contact Info */}
                <div className="space-y-4">
                    <h3 className="text-sm font-semibold text-gray-500 uppercase">Contact Information</h3>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="grid gap-2">
                            <Label htmlFor="email">Email</Label>
                            <Input
                                id="email"
                                name="email"
                                type="email"
                                defaultValue={initialData?.email}
                                placeholder="name@iblaw.com"
                                disabled={isFormDisabled}
                                aria-invalid={!!errors.email}
                                aria-describedby={errors.email ? "email-error" : undefined}
                            />
                            {errors.email && (
                                <p id="email-error" className="text-xs text-destructive">
                                    {errors.email}
                                </p>
                            )}
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="phone">Phone</Label>
                            <Input
                                id="phone"
                                name="phone"
                                type="tel"
                                defaultValue={initialData?.phone}
                                placeholder="+962 6 XXX XXXX"
                                disabled={isFormDisabled}
                                aria-invalid={!!errors.phone}
                                aria-describedby={errors.phone ? "phone-error" : undefined}
                            />
                            {errors.phone && (
                                <p id="phone-error" className="text-xs text-destructive">
                                    {errors.phone}
                                </p>
                            )}
                        </div>
                    </div>
                </div>

                {/* Files & Media Section */}
                <div className="space-y-4">
                    <h3 className="text-sm font-semibold text-gray-500 uppercase">Files & Media</h3>

                    <div className="grid gap-4">
                        {/* Photo Upload with Preview */}
                        <div className="grid gap-2">
                            <Label>Profile Photo</Label>

                            {photoUrl && (
                                <div className="relative w-40 h-40 rounded-lg overflow-hidden border-2 border-gray-200 group">
                                    <Image 
                                        src={photoUrl} 
                                        alt="Profile preview" 
                                        fill 
                                        className="object-cover" 
                                        unoptimized 
                                    />
                                    <Button
                                        type="button"
                                        onClick={handleRemovePhoto}
                                        className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1.5 hover:bg-red-600 shadow-lg transition-all opacity-0 group-hover:opacity-100"
                                        disabled={isFormDisabled}
                                        aria-label="Remove photo"
                                    >
                                        <X className="h-4 w-4" />
                                    </Button>
                                </div>
                            )}

                            <div className="flex gap-2">
                                <Input
                                    ref={photoInputRef}
                                    type="file"
                                    accept="image/*"
                                    onChange={handlePhotoUpload}
                                    className="hidden"
                                    disabled={isFormDisabled}
                                    aria-label="Upload photo"
                                />
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => photoInputRef.current?.click()}
                                    disabled={isFormDisabled}
                                    className="gap-2"
                                >
                                    {isUploadingPhoto ? (
                                        <>
                                            <Loader2 className="h-4 w-4 animate-spin" />
                                            Uploading...
                                        </>
                                    ) : (
                                        <>
                                            <Upload className="h-4 w-4" />
                                            {photoUrl ? "Change Photo" : "Upload Photo"}
                                        </>
                                    )}
                                </Button>
                            </div>

                            <input type="hidden" name="photo_url" value={photoUrl} />

                            <p className="text-xs text-muted-foreground">
                                Max size: 10MB. Formats: JPG, PNG, WebP. Photo will be optimized automatically.
                            </p>
                        </div>

                        {/* vCard Upload */}
                        <div className="grid gap-2">
                            <Label>vCard File</Label>

                            {vcardUrl && (
                                <div className="flex items-center gap-2 p-3 bg-green-50 border border-green-200 rounded-lg">
                                    <FileDown className="h-5 w-5 text-blue-600" />
                                    <span className="text-sm text-blue-700 flex-1">vCard uploaded</span>
                                    <button
                                        type="button"
                                        onClick={handleRemoveVcard}
                                        className="text-red-500 hover:text-red-600"
                                        disabled={isFormDisabled}
                                        aria-label="Remove vCard"
                                    >
                                        <X className="h-4 w-4" />
                                    </button>
                                </div>
                            )}

                            <div className="flex gap-2">
                                <Input
                                    ref={vcardInputRef}
                                    type="file"
                                    accept=".vcf"
                                    onChange={handleVcardUpload}
                                    className="hidden"
                                    disabled={isFormDisabled}
                                    aria-label="Upload vCard"
                                />
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => vcardInputRef.current?.click()}
                                    disabled={isFormDisabled}
                                    className="gap-2"
                                >
                                    {isUploadingVcard ? (
                                        <>
                                            <Loader2 className="h-4 w-4 animate-spin" />
                                            Uploading...
                                        </>
                                    ) : (
                                        <>
                                            <FileDown className="h-4 w-4" />
                                            {vcardUrl ? "Change vCard" : "Upload vCard"}
                                        </>
                                    )}
                                </Button>
                            </div>
                            <input type="hidden" name="vcard_url" value={vcardUrl} />
                            <p className="text-xs text-muted-foreground">
                                Max 1MB. .vcf file format only.
                            </p>
                        </div>

                        {/* Bio PDF Upload */}
                        <div className="grid gap-2">
                            <Label>Biography PDF</Label>

                            {pdfUrl && (
                                <div className="flex items-center gap-2 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                                    <FileText className="h-5 w-5 text-blue-600" />
                                    <span className="text-sm text-blue-700 flex-1">PDF uploaded</span>
                                    <button
                                        type="button"
                                        onClick={handleRemovePdf}
                                        className="text-red-500 hover:text-red-600"
                                        disabled={isFormDisabled}
                                        aria-label="Remove PDF"
                                    >
                                        <X className="h-4 w-4" />
                                    </button>
                                </div>
                            )}

                            <div className="flex gap-2">
                                <Input
                                    ref={pdfInputRef}
                                    type="file"
                                    accept=".pdf"
                                    onChange={handlePdfUpload}
                                    className="hidden"
                                    disabled={isFormDisabled}
                                    aria-label="Upload PDF"
                                />
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => pdfInputRef.current?.click()}
                                    disabled={isFormDisabled}
                                    className="gap-2"
                                >
                                    {isUploadingPdf ? (
                                        <>
                                            <Loader2 className="h-4 w-4 animate-spin" />
                                            Uploading...
                                        </>
                                    ) : (
                                        <>
                                            <FileText className="h-4 w-4" />
                                            {pdfUrl ? "Change PDF" : "Upload PDF"}
                                        </>
                                    )}
                                </Button>
                            </div>
                            <input type="hidden" name="bio_pdf_url" value={pdfUrl} />
                            <p className="text-xs text-muted-foreground">
                                Max 5MB. PDF format only.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Biography */}
                <div className="space-y-4">
                    <h3 className="text-sm font-semibold text-gray-500 uppercase">Profile Details</h3>

                    <div className="grid gap-2">
                        <Label htmlFor="biography">Biography</Label>
                        <Textarea
                            id="biography"
                            name="biography"
                            defaultValue={initialData?.biography}
                            placeholder="Write a detailed biography..."
                            rows={6}
                            disabled={isFormDisabled}
                            className="resize-none"
                            maxLength={5000}
                            aria-invalid={!!errors.biography}
                            aria-describedby={errors.biography ? "biography-error" : undefined}
                        />
                        {errors.biography && (
                            <p id="biography-error" className="text-xs text-destructive">
                                {errors.biography}
                            </p>
                        )}
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="education">Education</Label>
                        <Textarea
                            id="education"
                            name="education"
                            defaultValue={initialData?.education?.join('\n')}
                            placeholder="One qualification per line&#10;Example:&#10;LLM from University of X&#10;LLB from University of Y"
                            rows={4}
                            disabled={isFormDisabled}
                            className="resize-none font-mono text-sm"
                        />
                        <p className="text-xs text-muted-foreground">
                            Enter each qualification on a new line
                        </p>
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="practice_areas">Practice Areas</Label>
                        <Textarea
                            id="practice_areas"
                            name="practice_areas"
                            defaultValue={initialData?.practice_areas?.join('\n')}
                            placeholder="One practice area per line&#10;Example:&#10;Intellectual Property&#10;Corporate Law&#10;Litigation"
                            rows={4}
                            disabled={isFormDisabled}
                            className="resize-none font-mono text-sm"
                        />
                        <p className="text-xs text-muted-foreground">
                            Enter each practice area on a new line
                        </p>
                    </div>
                </div>
            </div>

            <div className="flex justify-end gap-2">
                <Button
                    type="button"
                    variant="outline"
                    onClick={onCancel}
                    disabled={isFormDisabled}
                >
                    Cancel
                </Button>
                <Button
                    type="submit"
                    disabled={isFormDisabled}
                    className="bg-main"
                >
                    {isPending ? (
                        <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Saving...
                        </>
                    ) : (
                        submitLabel
                    )}
                </Button>
            </div>
        </form>
    );
}