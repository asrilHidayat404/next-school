"use client";
import React, { useState, useRef } from "react";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { Button } from "./ui/button";
import toast from "react-hot-toast";
import { createPostAction, deletePostAction } from "@/src/action/PostAction";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/src/views/components/ui/alert-dialog"

interface DeletePostButtonProps {
    id: string;
}

const PostForm = () => {
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [saving, setSaving] = useState(false);
    const imageInput = useRef<HTMLInputElement>(null);

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        if (!file.type.startsWith("image/")) {
            toast.error("Pilih file gambar");
            return;
        }

        setImagePreview(URL.createObjectURL(file));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);

        const formData = new FormData();
        formData.append("title", title);
        formData.append("content", content);
        if (imageInput.current?.files?.[0]) {
            formData.append("image", imageInput.current.files[0]);
        }

        const res = await createPostAction(formData);
        if (res.success) {
            toast.success("Post Created!");
            setTitle("");
            setContent("");
            setImagePreview(null);
            if (imageInput.current) imageInput.current.value = "";
        } else {
            toast.error(res.error || "Failed to Create Post!");
        }

        setSaving(false);
    };

    return (
        <div className="mb-6 p-4 border rounded-lg">
            <h2 className="text-xl font-bold mb-4">Create New Post</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
                <Input
                    placeholder="Title"
                    value={title}
                    onChange={e => setTitle(e.target.value)}
                    required
                />
                <Textarea
                    placeholder="Content"
                    value={content}
                    onChange={e => setContent(e.target.value)}
                    required
                    rows={4}
                />
                <div>
                    <label className="block text-sm font-medium mb-2">Image (optional)</label>
                    <input
                        type="file"
                        ref={imageInput}
                        onChange={handleImageChange}
                        accept="image/*"
                        className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                    />
                </div>
                {imagePreview && (
                    <div className="mt-2">
                        <img src={imagePreview} alt="Preview" className="h-48 w-auto object-contain border rounded" />
                    </div>
                )}
                <Button type="submit" >
                    {saving ? "Publishing..." : "Publish"}
                </Button>
            </form>
        </div>
    );
};

export const DeletePostButton = ({ id }: DeletePostButtonProps) => {
    const [deleting, setDeleting] = useState(false);

    const handleDelete = async (id: string) => {

        setDeleting(true);
        const res = await deletePostAction(id);

        if (res.success) {
            toast.success("Post Deleted");
        } else {
            toast.error(res.error || "Failed to delete post");
        }
        setDeleting(false);
    };

    return (
        <AlertDialog>
            <AlertDialogTrigger asChild>
                <Button variant="destructive">Delete</Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                        This action cannot be undone. This will permanently delete your
                        account and remove your data from our servers.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction  
                    onClick={() => handleDelete(id)}
                            disabled={deleting}>
 
                            {deleting ? "Deleting..." : "Delete"}
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>

    );
};

export default PostForm;