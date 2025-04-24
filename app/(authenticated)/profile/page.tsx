'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { userService, UserProfile } from '@/services/user.service';
import { useAuth } from '@/lib/auth';

export default function ProfilePage() {
  const router = useRouter();
  const { token, isLoading: isAuthLoading, user } = useAuth();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<Partial<UserProfile>>({});

  console.log("user", user);  

  useEffect(() => {
    const fetchProfile = async () => {
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const data = await userService.getProfile(token);
        setProfile(data);
        setFormData(data);
      } catch (error) {
        console.error('Error fetching profile:', error);
        if (error instanceof Error && error.message.includes('Failed to fetch profile')) {
          router.push('/login');
        }
      } finally {
        setLoading(false);
      }
    };

    if (!isAuthLoading) {
      fetchProfile();
    }
  }, [token, isAuthLoading, router]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token || !profile) return;

    try {
      const updatedProfile = await userService.updateProfile(
        formData, 
        token, 
        user?.role as 'customer' | 'photographer'
      );
      setProfile(updatedProfile);
      setIsEditing(false);
    } catch (error) {
      console.error('Error updating profile:', error);
    } 
  };

  if (isAuthLoading || loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (!token) {
    router.push('/login');
    return null;
  }

  if (!profile) {
    return <div>Error loading profile</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Card className="max-w-2xl mx-auto">
        <CardHeader className="relative h-48">
          <Image
            src={profile.background_image || 'https://images.unsplash.com/photo-1509803874385-db7c23652552?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'}
            alt="Background"
            fill
            className="object-cover rounded-t-lg"
          />
          <div className="absolute -bottom-16 left-8">
            <div className="relative w-32 h-32 rounded-full border-4 border-white overflow-hidden">
              <Image
                src={profile.avatar}
                alt={profile.full_name}
                fill
                className="object-cover"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-20">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="full_name">Full Name</Label>
                <Input
                  id="full_name"
                  name="full_name"
                  value={formData.full_name || ''}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  name="email"
                  value={profile.email}
                  disabled
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="phone_number">Phone Number</Label>
                <Input
                  id="phone_number"
                  name="phone_number"
                  value={formData.phone_number || ''}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="location">Location</Label>
                <Input
                  id="location"
                  name="location"
                  value={formData.location || ''}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                />
              </div>
            </div>

            {profile.role === 'photographer' && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="bio">Bio</Label>
                  <Textarea
                    id="bio"
                    name="bio"
                    value={formData.bio || ''}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    rows={4}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="price_per_hour">Price per Hour (VND)</Label>
                    <Input
                      id="price_per_hour"
                      name="price_per_hour"
                      type="number"
                      value={formData.price_per_hour || ''}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="experience_year">Experience Years</Label>
                    <Input
                      id="experience_year"
                      name="experience_year"
                      type="number"
                      value={formData.experience_year || ''}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                    />
                  </div>
                </div>
              </>
            )}

            <div className="flex justify-end space-x-4">
              {!isEditing ? (
                <Button type="button" onClick={() => setIsEditing(true)}>
                  Edit Profile
                </Button>
              ) : (
                <>
                  <Button type="button" variant="outline" onClick={() => {
                    setIsEditing(false);
                    setFormData(profile);
                  }}>
                    Cancel
                  </Button>
                  <Button type="submit">
                    Save Changes
                  </Button>
                </>
              )}
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}