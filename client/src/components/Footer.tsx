import { Heart, Instagram, Facebook, Twitter } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-card border-t border-card-border py-12 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="grid md:grid-cols-3 gap-8 mb-8">
          {/* Brand */}
          <div className="text-center md:text-left">
            <div className="flex items-center gap-2 justify-center md:justify-start mb-4">
              <Heart className="text-primary" size={24} fill="currentColor" />
              <span className="font-cursive text-2xl text-primary">
                Sarah & Michael
              </span>
            </div>
            <p className="text-muted-foreground text-sm">
              Join us in celebrating our love story
            </p>
          </div>

          {/* Quick Links */}
          <div className="text-center">
            <h3 className="font-serif text-lg mb-4 text-foreground">
              Quick Links
            </h3>
            <div className="space-y-2">
              {["RSVP", "Registry", "Location", "Gallery"].map((link) => (
                <a
                  key={link}
                  href={`#${link.toLowerCase()}`}
                  className="block text-muted-foreground hover:text-primary transition-colors text-sm"
                  data-testid={`footer-link-${link.toLowerCase()}`}
                >
                  {link}
                </a>
              ))}
            </div>
          </div>

          {/* Social & Contact */}
          <div className="text-center md:text-right">
            <h3 className="font-serif text-lg mb-4 text-foreground">
              Connect With Us
            </h3>
            <div className="flex gap-3 justify-center md:justify-end mb-4">
              <a
                href="#"
                className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center hover-elevate text-primary"
                data-testid="link-instagram"
              >
                <Instagram size={18} />
              </a>
              <a
                href="#"
                className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center hover-elevate text-primary"
                data-testid="link-facebook"
              >
                <Facebook size={18} />
              </a>
              <a
                href="#"
                className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center hover-elevate text-primary"
                data-testid="link-twitter"
              >
                <Twitter size={18} />
              </a>
            </div>
            <p className="text-muted-foreground text-sm">
              #SarahAndMichael2025
            </p>
          </div>
        </div>

        {/* Copyright */}
        <div className="text-center pt-8 border-t border-card-border">
          <p className="text-muted-foreground text-sm">
            © 2025 Sarah & Michael. Made with{" "}
            <Heart
              size={14}
              className="inline text-primary"
              fill="currentColor"
            />{" "}
            for our special day
          </p>
        </div>
      </div>
    </footer>
  );
}
