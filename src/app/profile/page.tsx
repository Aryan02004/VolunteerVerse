"use client";

import React, { useEffect, useState } from "react";
import { useAuthSafe } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { FiUser, FiMail, FiPhone, FiCalendar, FiEdit } from "react-icons/fi";
import { supabase } from "@/lib/supabaseClient";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { Toaster } from "sonner";

// Define a type for the user data
interface UserProfileData {
  first_name?: string;
  last_name?: string;
  email?: string;
  phone?: string;
  user_type?: string;
  university?: string;
  roll_number?: string;
  student_email?: string;
  industry?: string;
  occupation?: string;
  work_email?: string;
  created_at?: string;
  [key: string]: unknown; // For any additional fields
}

interface EditFormData {
  first_name: string;
  last_name: string;
  phone: string;
  university?: string;
  roll_number?: string;
  student_email?: string;
  industry?: string;
  occupation?: string;
  work_email?: string;
}

const Profile = () => {
  const { user, userProfile, signOut, isLoading, refreshProfile } = useAuthSafe();
  const router = useRouter();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [editFormData, setEditFormData] = useState<EditFormData>({
    first_name: "",
    last_name: "",
    phone: "",
  });

  useEffect(() => {
    // Redirect if not logged in
    if (!isLoading && !user) {
      router.push("/login");
    }

    // Initialize form data when userProfile is available
    if (userProfile) {
      setEditFormData({
        first_name: userProfile.first_name || "",
        last_name: userProfile.last_name || "",
        phone: userProfile.phone || "",
        university: userProfile.university || "",
        roll_number: userProfile.roll_number || "",
        student_email: userProfile.student_email || "",
        industry: userProfile.industry || "",
        occupation: userProfile.occupation || "",
        work_email: userProfile.work_email || "",
      });
    }
  }, [userProfile, isLoading, user, router]);

  const handleLogOut = async () => {
    await signOut();
  };

  const handleEditClick = () => {
    setIsDialogOpen(true);
  };

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setEditFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSelectChange = (value: string, fieldName: string) => {
    setEditFormData((prev) => ({
      ...prev,
      [fieldName]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user) return;

    try {
      setIsSaving(true);

      // Prepare the data for update with proper typing
      const updateData: Partial<UserProfileData> = {
        first_name: editFormData.first_name,
        last_name: editFormData.last_name,
        phone: editFormData.phone,
      };

      // Add conditional fields based on user type
      if (userProfile?.user_type === "student") {
        updateData.university = editFormData.university;
        updateData.roll_number = editFormData.roll_number;
        updateData.student_email = editFormData.student_email;
      } else {
        updateData.industry = editFormData.industry;
        updateData.occupation = editFormData.occupation;
        updateData.work_email = editFormData.work_email;
      }

      // Update Supabase
      const updateTable = userProfile?.user_type
        ? "volunteer_users"  // Use volunteer_users if user_type exists (volunteer)
        : "users";           // Otherwise use users table

      const { error } = await supabase
        .from(updateTable)
        .update(updateData)
        .eq("id", user.id);

      if (error) {
        throw new Error(error.message);
      }

      // Refresh profile data
      await refreshProfile();

      // Close dialog
      setIsDialogOpen(false);

      // Show success message with sonner
      toast.success("Profile Updated", {
        description: "Your profile information has been updated successfully."
      });
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error("Update Failed", {
        description: "There was an error updating your profile. Please try again."
      });
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-zinc-900">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-cyan-500"></div>
      </div>
    );
  }

  if (!user || !userProfile) {
    return null; // Will redirect in the useEffect hook
  }

  // Format date
  const formatDate = (dateString: string | undefined) => {
    if (!dateString) return "N/A";
    
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString();
    } catch (error) {
      console.error("Error formatting date:", error);
      return "N/A";
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-zinc-900 pt-24 pb-16">
      <Toaster />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="bg-white dark:bg-zinc-800 rounded-xl shadow-lg overflow-hidden">
            {/* Profile Header */}
            <div className="p-8 bg-gradient-to-r from-cyan-500 to-cyan-700 text-white relative">
              <div className="flex flex-col md:flex-row gap-8 items-center">
                <div className="relative h-32 w-32 rounded-full overflow-hidden bg-white flex-shrink-0 border-4 border-white">
                  <div className="h-full w-full flex items-center justify-center text-4xl font-semibold text-cyan-500">
                    {userProfile?.first_name?.charAt(0) || 
                     user.email?.charAt(0) || 
                     "U"}
                  </div>
                </div>
                <div className="text-center md:text-left">
                  <h1 className="text-3xl font-bold mb-2">
                    {userProfile.first_name} {userProfile.last_name}
                  </h1>
                  <p className="text-cyan-100">
                    {userProfile?.user_type === "student"
                      ? "Student Volunteer"
                      : "Professional Volunteer"}
                  </p>
                </div>
              </div>
            </div>

            {/* Profile Details */}
            <div className="p-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Basic Information */}
                <div>
                  <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">
                    Basic Information
                  </h2>
                  <div className="space-y-4">
                    <div className="flex items-start">
                      <div className="h-8 w-8 rounded-full bg-cyan-100 dark:bg-cyan-900/50 flex items-center justify-center text-cyan-600 dark:text-cyan-400 mr-4">
                        <FiMail className="h-4 w-4" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Email</p>
                        <p className="font-medium dark:text-white">{userProfile.email}</p>
                      </div>
                    </div>

                    {userProfile?.phone && (
                      <div className="flex items-start">
                        <div className="h-8 w-8 rounded-full bg-cyan-100 dark:bg-cyan-900/50 flex items-center justify-center text-cyan-600 dark:text-cyan-400 mr-4">
                          <FiPhone className="h-4 w-4" />
                        </div>
                        <div>
                          <p className="text-sm text-gray-500 dark:text-gray-400">Phone</p>
                          <p className="font-medium dark:text-white">{userProfile.phone}</p>
                        </div>
                      </div>
                    )}

                    <div className="flex items-start">
                      <div className="h-8 w-8 rounded-full bg-cyan-100 dark:bg-cyan-900/50 flex items-center justify-center text-cyan-600 dark:text-cyan-400 mr-4">
                        <FiCalendar className="h-4 w-4" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Member Since</p>
                        <p className="font-medium dark:text-white">
                          {formatDate(userProfile.created_at)}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Additional Information */}
                <div>
                  <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">
                    {userProfile?.user_type === "student"
                      ? "Student Information"
                      : "Professional Information"}
                  </h2>

                  {userProfile?.user_type === "student" ? (
                    <div className="space-y-4">
                      {userProfile?.university && (
                        <div className="flex items-start">
                          <div className="h-8 w-8 rounded-full bg-cyan-100 dark:bg-cyan-900/50 flex items-center justify-center text-cyan-600 dark:text-cyan-400 mr-4">
                            <FiUser className="h-4 w-4" />
                          </div>
                          <div>
                            <p className="text-sm text-gray-500 dark:text-gray-400">University</p>
                            <p className="font-medium dark:text-white">{userProfile.university}</p>
                          </div>
                        </div>
                      )}

                      {userProfile?.roll_number && (
                        <div className="flex items-start">
                          <div className="h-8 w-8 rounded-full bg-cyan-100 dark:bg-cyan-900/50 flex items-center justify-center text-cyan-600 dark:text-cyan-400 mr-4">
                            <FiUser className="h-4 w-4" />
                          </div>
                          <div>
                            <p className="text-sm text-gray-500 dark:text-gray-400">Roll Number</p>
                            <p className="font-medium dark:text-white">{userProfile.roll_number}</p>
                          </div>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {userProfile?.industry && (
                        <div className="flex items-start">
                          <div className="h-8 w-8 rounded-full bg-cyan-100 dark:bg-cyan-900/50 flex items-center justify-center text-cyan-600 dark:text-cyan-400 mr-4">
                            <FiUser className="h-4 w-4" />
                          </div>
                          <div>
                            <p className="text-sm text-gray-500 dark:text-gray-400">Industry</p>
                            <p className="font-medium dark:text-white">{userProfile.industry}</p>
                          </div>
                        </div>
                      )}

                      {userProfile?.occupation && (
                        <div className="flex items-start">
                          <div className="h-8 w-8 rounded-full bg-cyan-100 dark:bg-cyan-900/50 flex items-center justify-center text-cyan-600 dark:text-cyan-400 mr-4">
                            <FiUser className="h-4 w-4" />
                          </div>
                          <div>
                            <p className="text-sm text-gray-500 dark:text-gray-400">Occupation</p>
                            <p className="font-medium dark:text-white">{userProfile.occupation}</p>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>

              {/* Action buttons */}
              <div className="mt-12 flex justify-end gap-2">
                <Button
                  variant="outline"
                  className="bg-white dark:bg-zinc-800 hover:bg-gray-100 dark:hover:bg-zinc-700 text-cyan-700 dark:text-cyan-400"
                  onClick={handleEditClick}
                >
                  <FiEdit className="mr-2" /> Edit Profile
                </Button>
                <Button variant="destructive" onClick={handleLogOut}>
                  Sign Out
                </Button>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Edit Profile Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Edit Profile</DialogTitle>
            <DialogDescription>
              Update your profile information. Click save when you&#39;re done.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit}>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="first_name">First Name</Label>
                  <Input
                    id="first_name"
                    name="first_name"
                    value={editFormData.first_name}
                    onChange={handleFormChange}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="last_name">Last Name</Label>
                  <Input
                    id="last_name"
                    name="last_name"
                    value={editFormData.last_name}
                    onChange={handleFormChange}
                    required
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                  id="phone"
                  name="phone"
                  value={editFormData.phone}
                  onChange={handleFormChange}
                  required
                />
              </div>

              {/* Conditional fields based on user type */}
              {userProfile?.user_type === "student" ? (
                <>
                  <div>
                    <Label htmlFor="university">University</Label>
                    <Input
                      id="university"
                      name="university"
                      value={editFormData.university}
                      onChange={handleFormChange}
                    />
                  </div>
                  <div>
                    <Label htmlFor="roll_number">Roll Number</Label>
                    <Input
                      id="roll_number"
                      name="roll_number"
                      value={editFormData.roll_number}
                      onChange={handleFormChange}
                    />
                  </div>
                  <div>
                    <Label htmlFor="student_email">
                      Student Email (Optional)
                    </Label>
                    <Input
                      id="student_email"
                      name="student_email"
                      type="email"
                      value={editFormData.student_email}
                      onChange={handleFormChange}
                    />
                  </div>
                </>
              ) : (
                <>
                  <div>
                    <Label htmlFor="industry">Industry</Label>
                    <Select
                      value={editFormData.industry}
                      onValueChange={(value) =>
                        handleSelectChange(value, "industry")
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select industry" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="technology">Technology</SelectItem>
                        <SelectItem value="healthcare">Healthcare</SelectItem>
                        <SelectItem value="education">Education</SelectItem>
                        <SelectItem value="finance">Finance</SelectItem>
                        <SelectItem value="manufacturing">
                          Manufacturing
                        </SelectItem>
                        <SelectItem value="retail">Retail</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="occupation">Occupation</Label>
                    <Input
                      id="occupation"
                      name="occupation"
                      value={editFormData.occupation}
                      onChange={handleFormChange}
                    />
                  </div>
                  <div>
                    <Label htmlFor="work_email">Work Email (Optional)</Label>
                    <Input
                      id="work_email"
                      name="work_email"
                      type="email"
                      value={editFormData.work_email}
                      onChange={handleFormChange}
                    />
                  </div>
                </>
              )}
            </div>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isSaving}
                className="bg-gradient-to-r from-cyan-500 to-cyan-700"
              >
                {isSaving && (
                  <span className="mr-2">
                    <svg
                      className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                  </span>
                )}
                {isSaving ? "Saving..." : "Save Changes"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Profile;