import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { API_ENDPOINTS } from '@/config/api';
import { Activity, ActivityType, ActivityStatus, CreateActivityPayload } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { Dumbbell, Plus, Pencil, Trash2, LogOut, Loader2, Utensils, Footprints } from 'lucide-react';
import { format } from 'date-fns';

const Activities = () => {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingActivity, setEditingActivity] = useState<Activity | null>(null);
  const [formData, setFormData] = useState<CreateActivityPayload>({
    activity_type: 'workout',
    description: '',
    date: format(new Date(), 'yyyy-MM-dd'),
    status: 'planned',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { getAccessToken, logout } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const fetchActivities = async () => {
    try {
      const response = await fetch(API_ENDPOINTS.ACTIVITIES.BASE, {
        headers: {
          Authorization: `Bearer ${getAccessToken()}`,
        },
      });

      if (!response.ok) {
        if (response.status === 401) {
          logout();
          navigate('/login');
          return;
        }
        throw new Error('Failed to fetch activities');
      }

      const data = await response.json();
      setActivities(data);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to load activities',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchActivities();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.description.trim()) {
      toast({
        title: 'Validation Error',
        description: 'Please enter a description',
        variant: 'destructive',
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const url = editingActivity
        ? API_ENDPOINTS.ACTIVITIES.UPDATE(editingActivity.id)
        : API_ENDPOINTS.ACTIVITIES.CREATE;

      const response = await fetch(url, {
        method: editingActivity ? 'PUT' : 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${getAccessToken()}`,
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error(editingActivity ? 'Failed to update activity' : 'Failed to create activity');
      }

      toast({
        title: 'Success',
        description: editingActivity ? 'Activity updated!' : 'Activity created!',
      });

      setIsDialogOpen(false);
      resetForm();
      fetchActivities();
    } catch (error) {
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Something went wrong',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      const response = await fetch(API_ENDPOINTS.ACTIVITIES.DELETE(id), {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${getAccessToken()}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to delete activity');
      }

      toast({
        title: 'Success',
        description: 'Activity deleted!',
      });

      fetchActivities();
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to delete activity',
        variant: 'destructive',
      });
    }
  };

  const handleEdit = (activity: Activity) => {
    setEditingActivity(activity);
    setFormData({
      activity_type: activity.activity_type,
      description: activity.description,
      date: activity.date,
      status: activity.status,
    });
    setIsDialogOpen(true);
  };

  const resetForm = () => {
    setEditingActivity(null);
    setFormData({
      activity_type: 'workout',
      description: '',
      date: format(new Date(), 'yyyy-MM-dd'),
      status: 'planned',
    });
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const getActivityIcon = (type: ActivityType) => {
    switch (type) {
      case 'workout':
        return <Dumbbell className="h-5 w-5" />;
      case 'meal':
        return <Utensils className="h-5 w-5" />;
      case 'steps':
        return <Footprints className="h-5 w-5" />;
    }
  };

  const getStatusColor = (status: ActivityStatus) => {
    switch (status) {
      case 'planned':
        return 'bg-muted text-muted-foreground';
      case 'in_progress':
        return 'bg-accent text-accent-foreground';
      case 'completed':
        return 'bg-primary text-primary-foreground';
    }
  };

  const getStatusLabel = (status: ActivityStatus) => {
    switch (status) {
      case 'planned':
        return 'Planned';
      case 'in_progress':
        return 'In Progress';
      case 'completed':
        return 'Completed';
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-lg">
              <Dumbbell className="h-6 w-6 text-primary" />
            </div>
            <h1 className="text-xl font-bold text-foreground">Fitness Tracker</h1>
          </div>
          <Button variant="outline" onClick={handleLogout} className="gap-2">
            <LogOut className="h-4 w-4" />
            Logout
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-bold text-foreground">My Activities</h2>
            <p className="text-muted-foreground">Track your daily fitness activities</p>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={(open) => {
            setIsDialogOpen(open);
            if (!open) resetForm();
          }}>
            <DialogTrigger asChild>
              <Button className="gap-2">
                <Plus className="h-4 w-4" />
                Add Activity
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-card border-border">
              <DialogHeader>
                <DialogTitle className="text-foreground">
                  {editingActivity ? 'Edit Activity' : 'Create New Activity'}
                </DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label className="text-foreground">Activity Type</Label>
                  <Select
                    value={formData.activity_type}
                    onValueChange={(value: ActivityType) =>
                      setFormData({ ...formData, activity_type: value })
                    }
                  >
                    <SelectTrigger className="bg-background border-border text-foreground">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-card border-border">
                      <SelectItem value="workout">Workout</SelectItem>
                      <SelectItem value="meal">Meal</SelectItem>
                      <SelectItem value="steps">Steps</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label className="text-foreground">Description</Label>
                  <Input
                    placeholder="e.g., Morning run 5km"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="bg-background border-border text-foreground placeholder:text-muted-foreground"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-foreground">Date</Label>
                  <Input
                    type="date"
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    className="bg-background border-border text-foreground"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-foreground">Status</Label>
                  <Select
                    value={formData.status}
                    onValueChange={(value: ActivityStatus) =>
                      setFormData({ ...formData, status: value })
                    }
                  >
                    <SelectTrigger className="bg-background border-border text-foreground">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-card border-border">
                      <SelectItem value="planned">Planned</SelectItem>
                      <SelectItem value="in_progress">In Progress</SelectItem>
                      <SelectItem value="completed">Completed</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Button type="submit" className="w-full" disabled={isSubmitting}>
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      {editingActivity ? 'Updating...' : 'Creating...'}
                    </>
                  ) : editingActivity ? (
                    'Update Activity'
                  ) : (
                    'Create Activity'
                  )}
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Activities List */}
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : activities.length === 0 ? (
          <Card className="bg-card border-border">
            <CardContent className="flex flex-col items-center justify-center py-12">
              <Dumbbell className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium text-foreground mb-2">No activities yet</h3>
              <p className="text-muted-foreground text-center mb-4">
                Start tracking your fitness journey by adding your first activity
              </p>
              <Button onClick={() => setIsDialogOpen(true)} className="gap-2">
                <Plus className="h-4 w-4" />
                Add Your First Activity
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {activities.map((activity) => (
              <Card key={activity.id} className="bg-card border-border hover:border-primary/50 transition-colors">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-primary/10 rounded-lg text-primary">
                        {getActivityIcon(activity.activity_type)}
                      </div>
                      <div>
                        <CardTitle className="text-foreground capitalize text-base">
                          {activity.activity_type}
                        </CardTitle>
                        <p className="text-xs text-muted-foreground">
                          {format(new Date(activity.date), 'MMM dd, yyyy')}
                        </p>
                      </div>
                    </div>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(activity.status)}`}>
                      {getStatusLabel(activity.status)}
                    </span>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-foreground mb-4">{activity.description}</p>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEdit(activity)}
                      className="flex-1 gap-2"
                    >
                      <Pencil className="h-3 w-3" />
                      Edit
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleDelete(activity.id)}
                      className="gap-2"
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default Activities;
