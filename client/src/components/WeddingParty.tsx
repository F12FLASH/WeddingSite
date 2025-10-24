import { Users, Heart, UserPlus } from "lucide-react";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { useQuery } from "@tanstack/react-query";
import type { WeddingParty as WeddingPartyType } from "@shared/schema";

export default function WeddingParty() {
  const [headerRef, headerInView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const { data: members = [], isLoading } = useQuery<WeddingPartyType[]>({
    queryKey: ["/api/wedding-party"],
  });

  // Sort members by order
  const sortedMembers = [...members].sort((a, b) => a.order - b.order);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.3,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        ease: "easeOut",
      },
    },
  };

  if (isLoading || members.length === 0) {
    return null;
  }

  return (
    <section id="wedding-party" className="section-padding bg-background overflow-hidden">
      <div className="container-max">
        {/* Section Header */}
        <motion.div
          ref={headerRef}
          initial={{ opacity: 0, y: 50 }}
          animate={headerInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="text-center mb-16"
        >
          <motion.h2 
            className="section-heading"
            data-testid="heading-wedding-party"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={headerInView ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            Đội Ngũ Đám Cưới
          </motion.h2>
          <motion.p 
            className="text-lg text-muted-foreground mt-2"
            initial={{ opacity: 0 }}
            animate={headerInView ? { opacity: 1 } : {}}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            Những người đồng hành cùng chúng tôi
          </motion.p>
          <motion.div 
            className="section-divider"
            initial={{ width: 0 }}
            animate={headerInView ? { width: "6rem" } : {}}
            transition={{ duration: 0.8, delay: 0.6 }}
          />
        </motion.div>

        {/* Team Members Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8"
        >
          {sortedMembers.map((member, index) => (
            <MemberCard key={member.id} member={member} index={index} variants={itemVariants} />
          ))}
        </motion.div>
      </div>
    </section>
  );
}

interface MemberCardProps {
  member: WeddingPartyType;
  index: number;
  variants: any;
}

function MemberCard({ member, index, variants }: MemberCardProps) {
  const [cardRef, cardInView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  return (
    <motion.div
      ref={cardRef}
      variants={variants}
      className="group relative"
      data-testid={`card-wedding-party-${member.id}`}
    >
      <div className="relative overflow-hidden rounded-2xl bg-card border border-border shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2">
        {/* Photo */}
        <div className="relative h-72 bg-gradient-to-br from-primary/10 to-primary/5 overflow-hidden">
          {member.photoUrl ? (
            <motion.img
              src={member.photoUrl}
              alt={member.name}
              className="w-full h-full object-cover"
              initial={{ scale: 1.1 }}
              whileInView={{ scale: 1 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <Users size={64} className="text-muted-foreground/30" />
            </div>
          )}
          
          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-card via-card/50 to-transparent opacity-90" />
          
          {/* Role Badge */}
          <div className="absolute top-4 right-4">
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              whileInView={{ scale: 1, rotate: 0 }}
              transition={{ delay: 0.2 + index * 0.1, type: "spring" }}
              viewport={{ once: true }}
              className="bg-primary/90 backdrop-blur-sm text-primary-foreground px-3 py-1.5 rounded-full text-xs font-medium shadow-lg"
            >
              {member.role}
            </motion.div>
          </div>

          {/* Floating Heart */}
          <motion.div
            className="absolute top-4 left-4 text-primary"
            animate={{
              y: [0, -10, 0],
              rotate: [0, 10, -10, 0],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut",
              delay: index * 0.2,
            }}
          >
            <Heart size={20} fill="currentColor" />
          </motion.div>
        </div>

        {/* Info */}
        <div className="p-6 relative">
          <motion.h3
            className="font-serif text-xl font-bold text-foreground mb-2"
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 + index * 0.1 }}
            viewport={{ once: true }}
            data-testid={`text-member-name-${member.id}`}
          >
            {member.name}
          </motion.h3>

          {member.description && (
            <motion.p
              className="text-sm text-muted-foreground leading-relaxed line-clamp-3"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ delay: 0.4 + index * 0.1 }}
              viewport={{ once: true }}
            >
              {member.description}
            </motion.p>
          )}

          {/* Decorative Element */}
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-primary/0 via-primary to-primary/0 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500" />
        </div>
      </div>
    </motion.div>
  );
}
