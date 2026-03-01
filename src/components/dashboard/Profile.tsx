import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { User, Mail, Weight, Ruler, Target, Activity, Calendar, Utensils, LogOut, Save, Trash2, MapPin } from 'lucide-react';
import { getUserSearchHistory, getUserMealPlans, updateProfile, deleteSearchHistoryItem, clearAllSearchHistory } from '@/db/api';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { getUserLocation, saveUserLocation, UserLocation } from '@/utils/buyLinks';

// Major Indian cities with coordinates for delivery tracking
const INDIAN_CITIES: UserLocation[] = [
  { city: 'Patna', state: 'Bihar', lat: 25.5941, lng: 85.1376 },
  { city: 'Mumbai', state: 'Maharashtra', lat: 19.0760, lng: 72.8777 },
  { city: 'Delhi', state: 'Delhi', lat: 28.7041, lng: 77.1025 },
  { city: 'Bangalore', state: 'Karnataka', lat: 12.9716, lng: 77.5946 },
  { city: 'Hyderabad', state: 'Telangana', lat: 17.3850, lng: 78.4867 },
  { city: 'Chennai', state: 'Tamil Nadu', lat: 13.0827, lng: 80.2707 },
  { city: 'Kolkata', state: 'West Bengal', lat: 22.5726, lng: 88.3639 },
  { city: 'Pune', state: 'Maharashtra', lat: 18.5204, lng: 73.8567 },
  { city: 'Ahmedabad', state: 'Gujarat', lat: 23.0225, lng: 72.5714 },
  { city: 'Jaipur', state: 'Rajasthan', lat: 26.9124, lng: 75.7873 },
  { city: 'Lucknow', state: 'Uttar Pradesh', lat: 26.8467, lng: 80.9462 },
  { city: 'Chandigarh', state: 'Chandigarh', lat: 30.7333, lng: 76.7794 },
  { city: 'Indore', state: 'Madhya Pradesh', lat: 22.7196, lng: 75.8577 },
  { city: 'Bhopal', state: 'Madhya Pradesh', lat: 23.2599, lng: 77.4126 },
  { city: 'Kochi', state: 'Kerala', lat: 9.9312, lng: 76.2673 },
  { city: 'Guwahati', state: 'Assam', lat: 26.1445, lng: 91.7362 },
  { city: 'Ranchi', state: 'Jharkhand', lat: 23.3441, lng: 85.3096 },
  { city: 'Bhubaneswar', state: 'Odisha', lat: 20.2961, lng: 85.8245 },
  { city: 'Visakhapatnam', state: 'Andhra Pradesh', lat: 17.6868, lng: 83.2185 },
  { city: 'Nagpur', state: 'Maharashtra', lat: 21.1458, lng: 79.0882 },
];

interface SearchHistoryItem {
  id: string;
  search_date: string;
  total_calories: number;
  foods: any[];
  created_at: string;
}

interface MealPlan {
  id: string;
  plan_name: string;
  total_calories: number;
  created_at: string;
}

export const Profile: React.FC = () => {
  const { user, profile, signOut, refreshProfile } = useAuth();
  const navigate = useNavigate();
  const [searchHistory, setSearchHistory] = useState<SearchHistoryItem[]>([]);
  const [savedPlans, setSavedPlans] = useState<MealPlan[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);

  // Profile form state
  const [weight, setWeight] = useState(profile?.current_weight?.toString() || '');
  const [height, setHeight] = useState(profile?.height?.toString() || '');
  const [targetWeight, setTargetWeight] = useState(profile?.target_weight?.toString() || '');
  const [age, setAge] = useState(profile?.age?.toString() || '');
  const [gender, setGender] = useState<'male' | 'female'>(profile?.gender || 'male');
  const [activityLevel, setActivityLevel] = useState<'sedentary' | 'light' | 'moderate' | 'active' | 'extra'>(profile?.activity_level || 'moderate');
  const [userLocation, setUserLocation] = useState<UserLocation>({ city: 'Patna', state: 'Bihar', lat: 25.5941, lng: 85.1376 });

  useEffect(() => {
    if (user) {
      loadUserData();
      loadUserLocation();
    }
  }, [user]);

  const loadUserLocation = async () => {
    const location = await getUserLocation();
    setUserLocation(location);
  };

  const loadUserData = async () => {
    if (!user) return;

    setLoading(true);
    const [historyResult, plansResult] = await Promise.all([
      getUserSearchHistory(user.id),
      getUserMealPlans(user.id),
    ]);

    if (!historyResult.error) {
      setSearchHistory(historyResult.data);
    }

    if (!plansResult.error) {
      setSavedPlans(plansResult.data);
    }

    setLoading(false);
  };

  const calculateBMI = () => {
    if (!weight || !height) return null;
    const w = parseFloat(weight);
    const h = parseFloat(height) / 100;
    return (w / (h * h)).toFixed(1);
  };

  const handleSaveProfile = async () => {
    if (!user) return;

    const updates: any = {};
    if (weight) updates.current_weight = parseFloat(weight);
    if (height) updates.height = parseFloat(height);
    if (targetWeight) updates.target_weight = parseFloat(targetWeight);
    if (age) updates.age = parseInt(age);
    if (gender) updates.gender = gender;
    if (activityLevel) updates.activity_level = activityLevel;

    const { error } = await updateProfile(user.id, updates);

    if (error) {
      toast.error('Failed to update profile');
    } else {
      toast.success('Profile updated successfully!');
      await refreshProfile();
      setEditing(false);
    }
  };

  const clearSearchHistory = async () => {
    if (!user) return;

    const { error } = await clearAllSearchHistory(user.id);
    if (error) {
      toast.error('Failed to clear history');
      console.error(error);
    } else {
      setSearchHistory([]);
      toast.success('Search history cleared');
    }
  };

  const removeSearchHistoryItem = async (historyId: string) => {
    const { error } = await deleteSearchHistoryItem(historyId);
    if (error) {
      toast.error('Failed to remove item');
      console.error(error);
    } else {
      setSearchHistory(searchHistory.filter(item => item.id !== historyId));
      toast.info('Item removed from history');
    }
  };

  const handleLogout = async () => {
    await signOut();
    toast.success('Logged out successfully');
    navigate('/');
  };

  const bmi = calculateBMI();

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <div className="flex flex-col md:flex-row gap-6 items-start md:items-center justify-between">
        <div>
          <h1 className="text-4xl font-black tracking-tight">
            Welcome! 👋
          </h1>
          <p className="text-muted-foreground font-medium mt-1">Manage your profile and view your activity</p>
        </div>

        <Button
          onClick={handleLogout}
          variant="outline"
          className="rounded-2xl h-12 px-6 font-bold glass border-destructive/20 hover:bg-destructive/10 hover:text-destructive"
        >
          <LogOut className="w-5 h-5 mr-2" />
          Logout
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Profile Card */}
        <div className="lg:col-span-1 space-y-6">
          <Card className="glass border-none rounded-[2.5rem] p-8">
            <CardHeader className="p-0 pb-6">
              <div className="mx-auto w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                <User className="w-12 h-12 text-primary" />
              </div>
              <CardTitle className="text-2xl font-black text-center">{profile?.username}</CardTitle>
              <p className="text-sm text-muted-foreground text-center font-medium flex items-center justify-center gap-2">
                <Mail className="w-4 h-4" />
                {profile?.email}
              </p>
            </CardHeader>

            <CardContent className="p-0 space-y-6">
              <Separator />

              {!editing ? (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-bold text-muted-foreground uppercase tracking-wider">Weight</span>
                    <span className="text-lg font-black">{profile?.current_weight || '--'} kg</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-bold text-muted-foreground uppercase tracking-wider">Height</span>
                    <span className="text-lg font-black">{profile?.height || '--'} cm</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-bold text-muted-foreground uppercase tracking-wider">BMI</span>
                    <span className="text-lg font-black text-primary">{bmi || '--'}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-bold text-muted-foreground uppercase tracking-wider">Target</span>
                    <span className="text-lg font-black">{profile?.target_weight || '--'} kg</span>
                  </div>

                  <Separator className="my-4" />

                  {/* Location Display */}
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-primary" />
                      <span className="text-sm font-bold text-muted-foreground uppercase tracking-wider">Delivery Location</span>
                    </div>
                    <div className="glass p-4 rounded-2xl bg-primary/5 border border-primary/20">
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-muted-foreground">City</span>
                          <span className="text-sm font-black">{userLocation.city}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-muted-foreground">State</span>
                          <span className="text-sm font-black">{userLocation.state}</span>
                        </div>
                        <div className="text-xs text-muted-foreground text-center mt-2 pt-2 border-t border-border/50">
                          📍 {userLocation.lat?.toFixed(4)}°N, {userLocation.lng?.toFixed(4)}°E
                        </div>
                      </div>
                    </div>
                  </div>

                  <Button
                    onClick={() => setEditing(true)}
                    className="w-full rounded-2xl h-12 font-bold nav-gradient-btn text-white mt-4"
                  >
                    Edit Profile
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label className="text-xs font-bold uppercase tracking-wider">Current Weight (kg)</Label>
                    <Input
                      type="number"
                      value={weight}
                      onChange={(e) => setWeight(e.target.value)}
                      className="rounded-2xl glass border-none"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs font-bold uppercase tracking-wider">Height (cm)</Label>
                    <Input
                      type="number"
                      value={height}
                      onChange={(e) => setHeight(e.target.value)}
                      className="rounded-2xl glass border-none"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs font-bold uppercase tracking-wider">Target Weight (kg)</Label>
                    <Input
                      type="number"
                      value={targetWeight}
                      onChange={(e) => setTargetWeight(e.target.value)}
                      className="rounded-2xl glass border-none"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs font-bold uppercase tracking-wider">Age</Label>
                    <Input
                      type="number"
                      value={age}
                      onChange={(e) => setAge(e.target.value)}
                      className="rounded-2xl glass border-none"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs font-bold uppercase tracking-wider">Gender</Label>
                    <Select value={gender} onValueChange={(v: any) => setGender(v)}>
                      <SelectTrigger className="rounded-2xl glass border-none">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="glass border-none rounded-2xl">
                        <SelectItem value="male">Male</SelectItem>
                        <SelectItem value="female">Female</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs font-bold uppercase tracking-wider">Activity Level</Label>
                    <Select value={activityLevel} onValueChange={(v: any) => setActivityLevel(v)}>
                      <SelectTrigger className="rounded-2xl glass border-none">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="glass border-none rounded-2xl">
                        <SelectItem value="sedentary">Sedentary</SelectItem>
                        <SelectItem value="light">Light</SelectItem>
                        <SelectItem value="moderate">Moderate</SelectItem>
                        <SelectItem value="active">Active</SelectItem>
                        <SelectItem value="extra">Extra Active</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <Separator className="my-4" />

                  {/* Location Selection */}
                  <div className="space-y-4">
                    <Label className="text-xs font-bold uppercase tracking-wider flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-primary" />
                      Delivery Location
                    </Label>
                    
                    {/* Predefined Cities Dropdown */}
                    <div className="space-y-2">
                      <Label className="text-xs text-muted-foreground">Select from popular cities</Label>
                      <Select 
                        value={`${userLocation.city}, ${userLocation.state}`} 
                        onValueChange={(value) => {
                          const [city, state] = value.split(', ');
                          const locationData = INDIAN_CITIES.find(loc => loc.city === city && loc.state === state);
                          if (locationData) {
                            setUserLocation(locationData);
                            saveUserLocation(locationData);
                            toast.success(`Location updated to ${city}, ${state}`);
                          }
                        }}
                      >
                        <SelectTrigger className="rounded-2xl glass border-none">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="glass border-none rounded-2xl max-h-[300px]">
                          {INDIAN_CITIES.map((location) => (
                            <SelectItem 
                              key={`${location.city}-${location.state}`} 
                              value={`${location.city}, ${location.state}`}
                            >
                              📍 {location.city}, {location.state}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Custom Location Input */}
                    <div className="space-y-2">
                      <Label className="text-xs text-muted-foreground">Or enter custom location</Label>
                      <div className="grid grid-cols-2 gap-2">
                        <Input
                          type="text"
                          placeholder="City"
                          value={userLocation.city}
                          onChange={(e) => {
                            const newLocation = { ...userLocation, city: e.target.value };
                            setUserLocation(newLocation);
                          }}
                          onBlur={() => {
                            saveUserLocation(userLocation);
                            toast.success('Custom location saved');
                          }}
                          className="rounded-2xl glass border-none"
                        />
                        <Input
                          type="text"
                          placeholder="State"
                          value={userLocation.state || ''}
                          onChange={(e) => {
                            const newLocation = { ...userLocation, state: e.target.value };
                            setUserLocation(newLocation);
                          }}
                          onBlur={() => {
                            saveUserLocation(userLocation);
                            toast.success('Custom location saved');
                          }}
                          className="rounded-2xl glass border-none"
                        />
                      </div>
                    </div>

                    {/* Optional: GPS Coordinates */}
                    <div className="space-y-2">
                      <Label className="text-xs text-muted-foreground">GPS Coordinates (optional)</Label>
                      <div className="grid grid-cols-2 gap-2">
                        <Input
                          type="number"
                          step="0.0001"
                          placeholder="Latitude"
                          value={userLocation.lat || ''}
                          onChange={(e) => {
                            const newLocation = { ...userLocation, lat: parseFloat(e.target.value) || undefined };
                            setUserLocation(newLocation);
                          }}
                          onBlur={() => {
                            saveUserLocation(userLocation);
                          }}
                          className="rounded-2xl glass border-none text-xs"
                        />
                        <Input
                          type="number"
                          step="0.0001"
                          placeholder="Longitude"
                          value={userLocation.lng || ''}
                          onChange={(e) => {
                            const newLocation = { ...userLocation, lng: parseFloat(e.target.value) || undefined };
                            setUserLocation(newLocation);
                          }}
                          onBlur={() => {
                            saveUserLocation(userLocation);
                          }}
                          className="rounded-2xl glass border-none text-xs"
                        />
                      </div>
                    </div>

                    <p className="text-xs text-muted-foreground mt-1">
                      Used for delivery platform availability and accurate pricing
                    </p>
                  </div>

                  <div className="flex gap-3 mt-4">
                    <Button
                      onClick={handleSaveProfile}
                      className="flex-1 rounded-2xl h-12 font-bold nav-gradient-btn text-white"
                    >
                      <Save className="w-4 h-4 mr-2" />
                      Save
                    </Button>
                    <Button
                      onClick={() => setEditing(false)}
                      variant="outline"
                      className="flex-1 rounded-2xl h-12 font-bold glass border-primary/20"
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Search History & Saved Plans */}
        <div className="lg:col-span-2 space-y-6">
          {/* Search History */}
          <Card className="glass border-none rounded-[2.5rem] p-8">
            <CardHeader className="p-0 pb-6">
              <div className="flex items-center justify-between">
                <CardTitle className="text-2xl font-black flex items-center gap-2">
                  <Calendar className="w-6 h-6 text-primary" />
                  Search History
                </CardTitle>
                {searchHistory.length > 0 && (
                  <Button
                    onClick={clearSearchHistory}
                    variant="ghost"
                    size="sm"
                    className="text-destructive hover:text-destructive hover:bg-destructive/10 rounded-xl font-bold"
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    Clear All
                  </Button>
                )}
              </div>
            </CardHeader>

            <CardContent className="p-0">
              {loading ? (
                <div className="text-center py-12">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
                </div>
              ) : searchHistory.length === 0 ? (
                <div className="text-center py-12 space-y-3">
                  <Utensils className="w-16 h-16 text-muted-foreground/30 mx-auto" />
                  <p className="text-lg font-bold text-muted-foreground">No search history yet</p>
                  <p className="text-sm text-muted-foreground">Start exploring foods to see your history here</p>
                </div>
              ) : (
                <ScrollArea className="h-[400px] pr-4">
                  <div className="space-y-4">
                    {searchHistory.map((item) => (
                      <motion.div
                        key={item.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="glass p-5 rounded-2xl hover:shadow-xl transition-all group"
                      >
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex-1">
                            <p className="text-sm font-bold text-muted-foreground">
                              {new Date(item.created_at).toLocaleDateString('en-US', {
                                month: 'short',
                                day: 'numeric',
                                year: 'numeric',
                              })}
                            </p>
                            <p className="text-lg font-black text-primary mt-1">{item.total_calories} kcal</p>
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge className="bg-primary/10 text-primary border-none px-3 py-1 rounded-xl font-bold">
                              {item.foods?.length || 0} items
                            </Badge>
                            <Button
                              onClick={() => removeSearchHistoryItem(item.id)}
                              variant="ghost"
                              size="icon"
                              className="rounded-full hover:bg-destructive/10 hover:text-destructive opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {item.foods?.slice(0, 3).map((food: any, idx: number) => (
                            <span key={idx} className="text-sm text-muted-foreground font-medium">
                              {food.food_name || food.name}
                              {idx < Math.min(2, (item.foods?.length || 1) - 1) && ','}
                            </span>
                          ))}
                          {(item.foods?.length || 0) > 3 && (
                            <span className="text-sm text-muted-foreground font-medium">
                              +{(item.foods?.length || 0) - 3} more
                            </span>
                          )}
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </ScrollArea>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};
