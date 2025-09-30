import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Briefcase, Palette, Zap, Users } from "lucide-react";
import Navbar from "@/components/Navbar";
import { supabase } from "@/integrations/supabase/client";
import heroImage from "@/assets/hero-portfolio.jpg";

const Index = () => {
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <Navbar user={user} />

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-accent/10 to-transparent" />
        <div className="container mx-auto px-4 py-20 lg:py-32 relative">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6 animate-fade-in">
              <h1 className="text-5xl lg:text-7xl font-bold leading-tight">
                Build Your
                <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                  {" "}
                  Professional Portfolio
                </span>
              </h1>
              <p className="text-xl text-muted-foreground">
                Showcase your work beautifully. Create a stunning portfolio in minutes with our
                intuitive builder.
              </p>
              <div className="flex gap-4">
                <Link to={user ? "/dashboard" : "/auth"}>
                  <Button size="lg" className="text-lg">
                    Get Started Free
                  </Button>
                </Link>
                <Link to="/portfolio/demo">
                  <Button size="lg" variant="outline" className="text-lg">
                    View Example
                  </Button>
                </Link>
              </div>
            </div>
            <div className="relative animate-fade-in">
              <img
                src={heroImage}
                alt="Portfolio Builder Hero"
                className="rounded-2xl shadow-2xl"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-secondary/20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">Why Choose PortfolioBuilder?</h2>
            <p className="text-xl text-muted-foreground">
              Everything you need to create a professional portfolio
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="animate-fade-in hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="h-12 w-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                  <Zap className="h-6 w-6 text-primary" />
                </div>
                <CardTitle>Lightning Fast</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Create your portfolio in minutes with our intuitive drag-and-drop interface
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="animate-fade-in hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="h-12 w-12 bg-accent/10 rounded-full flex items-center justify-center mb-4">
                  <Palette className="h-6 w-6 text-accent" />
                </div>
                <CardTitle>Beautiful Design</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Professionally designed templates that make your work shine
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="animate-fade-in hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="h-12 w-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                  <Briefcase className="h-6 w-6 text-primary" />
                </div>
                <CardTitle>Project Management</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Easily add, edit, and organize all your projects in one place
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="animate-fade-in hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="h-12 w-12 bg-accent/10 rounded-full flex items-center justify-center mb-4">
                  <Users className="h-6 w-6 text-accent" />
                </div>
                <CardTitle>Share Easily</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Get a custom URL to share your portfolio with potential clients and employers
                </CardDescription>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <Card className="bg-gradient-to-r from-primary to-accent text-primary-foreground">
            <CardHeader className="text-center py-12">
              <CardTitle className="text-4xl mb-4">Ready to Build Your Portfolio?</CardTitle>
              <CardDescription className="text-primary-foreground/90 text-lg mb-6">
                Join thousands of professionals showcasing their work
              </CardDescription>
              <div className="flex gap-4 justify-center">
                <Link to={user ? "/dashboard" : "/auth"}>
                  <Button size="lg" variant="secondary" className="text-lg">
                    Start Building Now
                  </Button>
                </Link>
              </div>
            </CardHeader>
          </Card>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-8">
        <div className="container mx-auto px-4 text-center text-muted-foreground">
          <p>&copy; 2025 PortfolioBuilder. Built with ❤️ using Lovable.</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
