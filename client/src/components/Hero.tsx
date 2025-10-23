import { Heart } from "lucide-react";
import heroImage from "@assets/generated_images/Romantic_wedding_couple_hero_background_0afd25e7.png";

export default function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image with Overlay */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${heroImage})` }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-primary/30 via-primary/10 to-background" />
      </div>

      {/* Floating Hearts Animation */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {[...Array(8)].map((_, i) => (
          <Heart
            key={i}
            className="absolute text-primary/20 animate-heart-float"
            style={{
              left: `${Math.random() * 100}%`,
              animationDelay: `${i * 2}s`,
              animationDuration: `${15 + Math.random() * 5}s`,
              fontSize: `${20 + Math.random() * 20}px`,
            }}
            fill="currentColor"
          />
        ))}
      </div>

      {/* Content */}
      <div className="relative z-10 text-center px-4 max-w-4xl mx-auto animate-fade-in-up">
        <div className="mb-8">
          <p
            className="text-muted-foreground text-lg md:text-xl mb-4"
            data-testid="text-wedding-announcement"
          >
            We're Getting Married
          </p>
          <h1
            className="font-cursive text-5xl md:text-7xl lg:text-8xl mb-6 text-foreground"
            data-testid="text-couple-names"
          >
            Sarah & Michael
          </h1>
          <p
            className="font-serif text-2xl md:text-3xl text-foreground mb-8"
            data-testid="text-wedding-date"
          >
            June 15, 2025
          </p>
        </div>

        {/* Countdown Timer */}
        <div
          className="flex justify-center gap-4 md:gap-8 mb-12"
          data-testid="countdown-timer"
        >
          {[
            { value: 120, label: "Days" },
            { value: 5, label: "Hours" },
            { value: 30, label: "Minutes" },
            { value: 45, label: "Seconds" },
          ].map((item, i) => (
            <div
              key={i}
              className="text-center backdrop-blur-md bg-card/80 rounded-2xl p-4 md:p-6 border border-card-border shadow-lg animate-scale-in"
              style={{ animationDelay: `${i * 0.1}s` }}
            >
              <div className="text-3xl md:text-4xl font-serif font-bold text-primary">
                {item.value}
              </div>
              <div className="text-xs md:text-sm text-muted-foreground mt-1">
                {item.label}
              </div>
            </div>
          ))}
        </div>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <a
            href="#rsvp"
            className="inline-flex items-center justify-center min-h-9 px-8 rounded-md bg-primary text-primary-foreground border border-primary-border hover-elevate active-elevate-2 font-medium shadow-lg"
            data-testid="button-rsvp"
          >
            RSVP Now
          </a>
          <a
            href="#registry"
            className="inline-flex items-center justify-center min-h-9 px-8 rounded-md backdrop-blur-md bg-background/50 text-foreground border border-border hover-elevate active-elevate-2 font-medium"
            data-testid="button-registry"
          >
            View Registry
          </a>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-float">
        <div className="w-6 h-10 border-2 border-foreground/30 rounded-full flex justify-center">
          <div className="w-1 h-2 bg-foreground/30 rounded-full mt-2 animate-pulse" />
        </div>
      </div>
    </section>
  );
}
