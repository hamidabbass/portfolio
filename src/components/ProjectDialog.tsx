import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Upload } from "lucide-react";

interface ProjectDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  project?: any;
  userId?: string;
}

const ProjectDialog = ({ open, onOpenChange, project, userId }: ProjectDialogProps) => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    image_url: "",
    demo_url: "",
    github_url: "",
    tags: "",
  });

  useEffect(() => {
    if (project) {
      setFormData({
        title: project.title || "",
        description: project.description || "",
        image_url: project.image_url || "",
        demo_url: project.demo_url || "",
        github_url: project.github_url || "",
        tags: project.tags?.join(", ") || "",
      });
    } else {
      setFormData({
        title: "",
        description: "",
        image_url: "",
        demo_url: "",
        github_url: "",
        tags: "",
      });
    }
  }, [project, open]);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !userId) return;

    setUploading(true);
    const fileExt = file.name.split(".").pop();
    const fileName = `${userId}/${Math.random()}.${fileExt}`;

    const { error: uploadError, data } = await supabase.storage
      .from("project-images")
      .upload(fileName, file);

    if (uploadError) {
      toast({
        title: "Upload Error",
        description: uploadError.message,
        variant: "destructive",
      });
      setUploading(false);
      return;
    }

    const { data: { publicUrl } } = supabase.storage
      .from("project-images")
      .getPublicUrl(fileName);

    setFormData((prev) => ({ ...prev, image_url: publicUrl }));
    setUploading(false);
    toast({
      title: "Success",
      description: "Image uploaded successfully",
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userId) return;

    setLoading(true);

    const projectData = {
      user_id: userId,
      title: formData.title,
      description: formData.description,
      image_url: formData.image_url || null,
      demo_url: formData.demo_url || null,
      github_url: formData.github_url || null,
      tags: formData.tags
        .split(",")
        .map((tag) => tag.trim())
        .filter(Boolean),
    };

    let error;

    if (project) {
      ({ error } = await supabase
        .from("projects")
        .update(projectData)
        .eq("id", project.id));
    } else {
      ({ error } = await supabase.from("projects").insert([projectData]));
    }

    setLoading(false);

    if (error) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } else {
      toast({
        title: "Success",
        description: `Project ${project ? "updated" : "created"} successfully`,
      });
      onOpenChange(true);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{project ? "Edit Project" : "Add New Project"}</DialogTitle>
          <DialogDescription>
            {project ? "Update your project details" : "Add a new project to your portfolio"}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Project Title *</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description *</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={4}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="image">Project Image</Label>
            <div className="flex gap-2">
              <Input
                id="image"
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                disabled={uploading}
              />
              {uploading && <span className="text-sm text-muted-foreground">Uploading...</span>}
            </div>
            {formData.image_url && (
              <img
                src={formData.image_url}
                alt="Preview"
                className="w-full h-48 object-cover rounded-md mt-2"
              />
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="demo_url">Demo URL</Label>
            <Input
              id="demo_url"
              type="url"
              placeholder="https://..."
              value={formData.demo_url}
              onChange={(e) => setFormData({ ...formData, demo_url: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="github_url">GitHub URL</Label>
            <Input
              id="github_url"
              type="url"
              placeholder="https://github.com/..."
              value={formData.github_url}
              onChange={(e) => setFormData({ ...formData, github_url: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="tags">Tags (comma-separated)</Label>
            <Input
              id="tags"
              placeholder="React, TypeScript, Tailwind"
              value={formData.tags}
              onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
            />
          </div>

          <div className="flex gap-2 justify-end">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Saving..." : project ? "Update" : "Create"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ProjectDialog;
