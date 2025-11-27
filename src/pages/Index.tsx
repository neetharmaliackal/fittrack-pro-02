import { Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Dumbbell, Activity, TrendingUp, Users } from 'lucide-react';

const Index = () => {
  const { isAuthenticated } = useAuth();

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
          <div className="flex gap-3">
            {isAuthenticated ? (
              <Link to="/activities">
                <Button>Go to Dashboard</Button>
              </Link>
            ) : (
              <>
                <Link to="/login">
                  <Button variant="outline">Sign In</Button>
                </Link>
                <Link to="/register">
                  <Button>Get Started</Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 text-center">
        <div className="max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full mb-6">
            <Activity className="h-4 w-4" />
            <span className="text-sm font-medium">Track Your Progress</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
            Your Personal{' '}
            <span className="text-primary">Fitness Journey</span>{' '}
            Starts Here
          </h2>
          <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
            Track your workouts, meals, and daily steps. Stay motivated with our intuitive activity management system designed to help you achieve your fitness goals.
          </p>
          <div className="flex gap-4 justify-center">
            <Link to="/register">
              <Button size="lg" className="gap-2">
                <Dumbbell className="h-5 w-5" />
                Start Tracking
              </Button>
            </Link>
            <Link to="/login">
              <Button size="lg" variant="outline">
                Sign In
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="grid md:grid-cols-3 gap-8">
          <div className="bg-card border border-border rounded-xl p-6 text-center">
            <div className="inline-flex items-center justify-center p-3 bg-primary/10 rounded-lg mb-4">
              <Activity className="h-6 w-6 text-primary" />
            </div>
            <h3 className="text-lg font-semibold text-foreground mb-2">Track Activities</h3>
            <p className="text-muted-foreground">
              Log your workouts, meals, and steps with ease. Keep everything organized in one place.
            </p>
          </div>
          <div className="bg-card border border-border rounded-xl p-6 text-center">
            <div className="inline-flex items-center justify-center p-3 bg-accent/10 rounded-lg mb-4">
              <TrendingUp className="h-6 w-6 text-accent" />
            </div>
            <h3 className="text-lg font-semibold text-foreground mb-2">Monitor Progress</h3>
            <p className="text-muted-foreground">
              Update activity status from planned to in progress to completed. See your journey unfold.
            </p>
          </div>
          <div className="bg-card border border-border rounded-xl p-6 text-center">
            <div className="inline-flex items-center justify-center p-3 bg-primary/10 rounded-lg mb-4">
              <Users className="h-6 w-6 text-primary" />
            </div>
            <h3 className="text-lg font-semibold text-foreground mb-2">Personal Dashboard</h3>
            <p className="text-muted-foreground">
              Your own secure space to manage all your fitness activities and track your daily progress.
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border bg-card mt-auto">
        <div className="container mx-auto px-4 py-6 text-center text-muted-foreground">
          <p>&copy; 2024 Fitness Tracker. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
