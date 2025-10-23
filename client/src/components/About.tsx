import bridePhoto from "@assets/generated_images/Elegant_bride_portrait_photo_6abee8e2.png";
import groomPhoto from "@assets/generated_images/Handsome_groom_portrait_photo_1678e40a.png";

export default function About() {
  return (
    <section id="about" className="py-20 md:py-32 px-4 bg-card">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16 animate-fade-in-up">
          <h2
            className="font-serif text-4xl md:text-5xl mb-4 text-foreground"
            data-testid="heading-about"
          >
            Our Story
          </h2>
          <div className="w-24 h-1 bg-primary mx-auto" />
        </div>

        <div className="grid md:grid-cols-2 gap-12 md:gap-20 items-center">
          {/* Bride */}
          <div className="text-center animate-scale-in">
            <div className="relative inline-block mb-6">
              <div className="w-64 h-64 md:w-80 md:h-80 rounded-full overflow-hidden border-4 border-primary/20 shadow-xl">
                <img
                  src={bridePhoto}
                  alt="Bride"
                  className="w-full h-full object-cover"
                  data-testid="img-bride"
                />
              </div>
              <Heart
                className="absolute -top-2 -right-2 text-primary animate-float"
                size={40}
                fill="currentColor"
              />
            </div>
            <h3
              className="font-cursive text-4xl md:text-5xl mb-2 text-primary"
              data-testid="text-bride-name"
            >
              Sarah
            </h3>
            <p className="text-muted-foreground max-w-sm mx-auto leading-relaxed">
              A passionate designer who loves art, flowers, and creating
              beautiful moments. She believes in the magic of love and the
              power of togetherness.
            </p>
          </div>

          {/* Groom */}
          <div className="text-center animate-scale-in" style={{ animationDelay: "0.2s" }}>
            <div className="relative inline-block mb-6">
              <div className="w-64 h-64 md:w-80 md:h-80 rounded-full overflow-hidden border-4 border-primary/20 shadow-xl">
                <img
                  src={groomPhoto}
                  alt="Groom"
                  className="w-full h-full object-cover"
                  data-testid="img-groom"
                />
              </div>
              <Heart
                className="absolute -top-2 -left-2 text-primary animate-float"
                size={40}
                fill="currentColor"
                style={{ animationDelay: "1s" }}
              />
            </div>
            <h3
              className="font-cursive text-4xl md:text-5xl mb-2 text-primary"
              data-testid="text-groom-name"
            >
              Michael
            </h3>
            <p className="text-muted-foreground max-w-sm mx-auto leading-relaxed">
              An adventurous soul with a heart of gold. He enjoys photography,
              traveling, and making Sarah laugh every single day.
            </p>
          </div>
        </div>

        {/* Our Story Text */}
        <div className="mt-20 max-w-3xl mx-auto text-center animate-fade-in-up" style={{ animationDelay: "0.4s" }}>
          <p
            className="text-lg md:text-xl leading-relaxed text-foreground mb-6"
            data-testid="text-our-story"
          >
            We met on a rainy autumn day in a cozy coffee shop. What started as
            a chance encounter over a shared love for cappuccinos turned into
            endless conversations, adventures, and a bond that grew stronger
            with each passing day.
          </p>
          <p className="text-lg md:text-xl leading-relaxed text-muted-foreground">
            After three wonderful years together, Michael proposed during a
            sunset picnic by the lake. Now, we're excited to celebrate our love
            with the people who mean the most to us.
          </p>
        </div>
      </div>
    </section>
  );
}

function Heart({ className, size, fill, style }: { className?: string; size?: number; fill?: string; style?: React.CSSProperties }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size || 24}
      height={size || 24}
      viewBox="0 0 24 24"
      fill={fill || "none"}
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      style={style}
    >
      <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
    </svg>
  );
}
