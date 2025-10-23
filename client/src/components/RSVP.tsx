import { useState } from "react";
import { Calendar, Mail, Phone, Users, Utensils } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";

export default function RSVP() {
  const [formData, setFormData] = useState({
    guestName: "",
    email: "",
    phone: "",
    attending: true,
    guestCount: 1,
    mealPreference: "",
    specialRequirements: "",
  });

  const { toast } = useToast();

  const createRsvpMutation = useMutation({
    mutationFn: async (data: typeof formData) => {
      return await apiRequest("POST", "/api/rsvps", data);
    },
    onSuccess: () => {
      toast({
        title: "RSVP Received!",
        description: "Thank you for your response. We can't wait to celebrate with you!",
      });
      setFormData({
        guestName: "",
        email: "",
        phone: "",
        attending: true,
        guestCount: 1,
        mealPreference: "",
        specialRequirements: "",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to submit RSVP. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.guestName || !formData.email) {
      toast({
        title: "Missing information",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    createRsvpMutation.mutate(formData);
  };

  return (
    <section id="rsvp" className="py-20 md:py-32 px-4 bg-card">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-16 animate-fade-in-up">
          <h2
            className="font-serif text-4xl md:text-5xl mb-4 text-foreground"
            data-testid="heading-rsvp"
          >
            RSVP
          </h2>
          <div className="w-24 h-1 bg-primary mx-auto mb-4" />
          <p className="text-muted-foreground text-lg">
            Please respond by May 1, 2025
          </p>
        </div>

        <div className="grid lg:grid-cols-5 gap-8">
          {/* Form */}
          <div className="lg:col-span-3 animate-fade-in-up">
            <div className="bg-background rounded-2xl p-6 md:p-8 border border-border shadow-lg">
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Name */}
                <div>
                  <Label htmlFor="name" className="text-foreground mb-2 block">
                    Full Name *
                  </Label>
                  <Input
                    id="name"
                    type="text"
                    placeholder="John Doe"
                    className="rounded-xl"
                    required
                    value={formData.guestName}
                    onChange={(e) => setFormData({ ...formData, guestName: e.target.value })}
                    data-testid="input-rsvp-name"
                    disabled={createRsvpMutation.isPending}
                  />
                </div>

                {/* Email */}
                <div>
                  <Label htmlFor="email" className="text-foreground mb-2 block">
                    Email *
                  </Label>
                  <div className="relative">
                    <Mail
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                      size={18}
                    />
                    <Input
                      id="email"
                      type="email"
                      placeholder="john@example.com"
                      className="pl-10 rounded-xl"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      data-testid="input-rsvp-email"
                      disabled={createRsvpMutation.isPending}
                    />
                  </div>
                </div>

                {/* Phone */}
                <div>
                  <Label htmlFor="phone" className="text-foreground mb-2 block">
                    Phone Number
                  </Label>
                  <div className="relative">
                    <Phone
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                      size={18}
                    />
                    <Input
                      id="phone"
                      type="tel"
                      placeholder="+1 (555) 000-0000"
                      className="pl-10 rounded-xl"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      data-testid="input-rsvp-phone"
                      disabled={createRsvpMutation.isPending}
                    />
                  </div>
                </div>

                {/* Attending */}
                <div>
                  <Label className="text-foreground mb-3 block">
                    Will you be attending? *
                  </Label>
                  <RadioGroup
                    value={formData.attending ? "yes" : "no"}
                    onValueChange={(value) => setFormData({ ...formData, attending: value === "yes" })}
                    className="flex gap-4"
                    data-testid="radio-attending"
                    disabled={createRsvpMutation.isPending}
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="yes" id="yes" />
                      <Label htmlFor="yes" className="cursor-pointer">
                        Yes, I'll be there
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="no" id="no" />
                      <Label htmlFor="no" className="cursor-pointer">
                        Sadly, I can't make it
                      </Label>
                    </div>
                  </RadioGroup>
                </div>

                {formData.attending && (
                  <>
                    {/* Guest Count */}
                    <div>
                      <Label className="text-foreground mb-2 block flex items-center gap-2">
                        <Users size={18} />
                        Number of Guests
                      </Label>
                      <div className="flex items-center gap-3">
                        <Button
                          type="button"
                          variant="outline"
                          size="icon"
                          onClick={() => setFormData({ ...formData, guestCount: Math.max(1, formData.guestCount - 1) })}
                          data-testid="button-decrease-guests"
                          disabled={createRsvpMutation.isPending}
                        >
                          -
                        </Button>
                        <span
                          className="text-xl font-medium w-12 text-center"
                          data-testid="text-guest-count"
                        >
                          {formData.guestCount}
                        </span>
                        <Button
                          type="button"
                          variant="outline"
                          size="icon"
                          onClick={() => setFormData({ ...formData, guestCount: Math.min(10, formData.guestCount + 1) })}
                          data-testid="button-increase-guests"
                          disabled={createRsvpMutation.isPending}
                        >
                          +
                        </Button>
                      </div>
                    </div>

                    {/* Meal Preference */}
                    <div>
                      <Label htmlFor="meal" className="text-foreground mb-2 block flex items-center gap-2">
                        <Utensils size={18} />
                        Meal Preference
                      </Label>
                      <Select
                        value={formData.mealPreference}
                        onValueChange={(value) => setFormData({ ...formData, mealPreference: value })}
                        disabled={createRsvpMutation.isPending}
                      >
                        <SelectTrigger
                          id="meal"
                          className="rounded-xl"
                          data-testid="select-meal"
                        >
                          <SelectValue placeholder="Select your preference" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="chicken">Chicken</SelectItem>
                          <SelectItem value="beef">Beef</SelectItem>
                          <SelectItem value="fish">Fish</SelectItem>
                          <SelectItem value="vegetarian">Vegetarian</SelectItem>
                          <SelectItem value="vegan">Vegan</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Special Requirements */}
                    <div>
                      <Label htmlFor="special" className="text-foreground mb-2 block">
                        Special Requirements
                      </Label>
                      <Textarea
                        id="special"
                        placeholder="Dietary restrictions, allergies, accessibility needs..."
                        rows={3}
                        className="rounded-xl resize-none"
                        value={formData.specialRequirements}
                        onChange={(e) => setFormData({ ...formData, specialRequirements: e.target.value })}
                        data-testid="input-special-requirements"
                        disabled={createRsvpMutation.isPending}
                      />
                    </div>
                  </>
                )}

                <Button
                  type="submit"
                  className="w-full rounded-xl"
                  size="lg"
                  data-testid="button-submit-rsvp"
                  disabled={createRsvpMutation.isPending}
                >
                  <Calendar size={18} className="mr-2" />
                  {createRsvpMutation.isPending ? "Submitting..." : "Submit RSVP"}
                </Button>
              </form>
            </div>
          </div>

          {/* Event Details Sidebar */}
          <div className="lg:col-span-2 animate-fade-in-up" style={{ animationDelay: "0.2s" }}>
            <div className="bg-primary/5 rounded-2xl p-6 md:p-8 border border-primary/20 sticky top-4">
              <h3 className="font-serif text-2xl mb-6 text-foreground">
                Event Details
              </h3>
              <div className="space-y-6">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Date</p>
                  <p className="text-foreground font-medium">June 15, 2025</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Time</p>
                  <p className="text-foreground font-medium">3:00 PM</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Venue</p>
                  <p className="text-foreground font-medium">
                    Rose Garden Estate
                  </p>
                  <p className="text-sm text-muted-foreground mt-1">
                    123 Garden Lane, Spring Valley, CA 91977
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-2">
                    Dress Code
                  </p>
                  <p className="text-foreground font-medium">
                    Formal / Black Tie Optional
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
