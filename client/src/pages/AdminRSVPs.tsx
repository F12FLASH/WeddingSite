import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Check, X, Heart } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import type { Rsvp } from "@shared/schema";

export default function AdminRSVPs() {
  const { data: rsvps = [], isLoading, isError, error } = useQuery<Rsvp[]>({
    queryKey: ["/api/rsvps"],
  });

  const attendingCount = rsvps.filter((r) => r.attending).length;
  const totalGuests = rsvps.reduce(
    (sum, r) => sum + (r.attending ? r.guestCount : 0),
    0
  );

  if (isLoading) {
    return (
      <div>
        <div className="mb-8">
          <h2 className="text-3xl font-serif mb-2 text-foreground">RSVP Management</h2>
          <p className="text-muted-foreground">Track and manage guest responses</p>
        </div>
        <div className="grid gap-6 md:grid-cols-3 mb-8">
          {[...Array(3)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader className="space-y-0 pb-2">
                <div className="h-4 bg-muted rounded w-1/2" />
              </CardHeader>
              <CardContent>
                <div className="h-8 bg-muted rounded w-1/3" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div>
        <div className="mb-8">
          <h2 className="text-3xl font-serif mb-2 text-foreground">RSVP Management</h2>
          <p className="text-muted-foreground">Track and manage guest responses</p>
        </div>
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Heart className="text-destructive mb-4" size={64} />
            <p className="text-destructive text-lg mb-2">Failed to load RSVPs</p>
            <p className="text-muted-foreground">{error instanceof Error ? error.message : "Please try again later"}</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8">
        <h2 className="text-3xl font-serif mb-2 text-foreground" data-testid="heading-rsvps">
          RSVP Management
        </h2>
        <p className="text-muted-foreground">
          Track and manage guest responses
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-3 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Responses
            </CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{rsvps.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Attending</CardTitle>
            <Check className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">
              {attendingCount}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Guests</CardTitle>
            <Users className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalGuests}</div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All RSVPs</CardTitle>
        </CardHeader>
        <CardContent>
          {rsvps.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12">
              <Heart className="text-muted-foreground mb-4" size={64} />
              <p className="text-muted-foreground text-lg">No RSVPs yet</p>
            </div>
          ) : (
            <div className="space-y-3">
              {rsvps.map((rsvp) => (
                <div
                  key={rsvp.id}
                  className="flex items-center justify-between p-4 bg-muted/50 rounded-lg"
                  data-testid={`rsvp-${rsvp.id}`}
                >
                  <div className="flex-1">
                    <p className="font-medium text-foreground">{rsvp.guestName}</p>
                    <p className="text-sm text-muted-foreground">{rsvp.email}</p>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      {rsvp.attending ? (
                        <>
                          <p className="text-sm font-medium text-primary flex items-center gap-1">
                            <Check size={16} />
                            Attending
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {rsvp.guestCount} {rsvp.guestCount === 1 ? "guest" : "guests"}
                            {rsvp.mealPreference && ` • ${rsvp.mealPreference}`}
                          </p>
                        </>
                      ) : (
                        <p className="text-sm font-medium text-muted-foreground flex items-center gap-1">
                          <X size={16} />
                          Declined
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
