import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Save } from "lucide-react";

export default function AdminCouple() {
  return (
    <div>
      <div className="mb-8">
        <h2 className="text-3xl font-serif mb-2 text-foreground" data-testid="heading-couple-info">
          Couple Information
        </h2>
        <p className="text-muted-foreground">
          Manage your wedding couple details
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Edit Couple Details</CardTitle>
        </CardHeader>
        <CardContent>
          <form className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="brideName">Bride's Name</Label>
                <Input
                  id="brideName"
                  defaultValue="Sarah"
                  className="mt-2"
                  data-testid="input-bride-name"
                />
              </div>
              <div>
                <Label htmlFor="groomName">Groom's Name</Label>
                <Input
                  id="groomName"
                  defaultValue="Michael"
                  className="mt-2"
                  data-testid="input-groom-name"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="weddingDate">Wedding Date</Label>
              <Input
                id="weddingDate"
                type="date"
                defaultValue="2025-06-15"
                className="mt-2"
                data-testid="input-wedding-date"
              />
            </div>

            <div>
              <Label htmlFor="ourStory">Our Story</Label>
              <Textarea
                id="ourStory"
                rows={6}
                defaultValue="We met on a rainy autumn day in a cozy coffee shop..."
                className="mt-2"
                data-testid="input-our-story"
              />
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="bridePhoto">Bride Photo URL</Label>
                <Input
                  id="bridePhoto"
                  placeholder="Upload or paste image URL"
                  className="mt-2"
                  data-testid="input-bride-photo"
                />
              </div>
              <div>
                <Label htmlFor="groomPhoto">Groom Photo URL</Label>
                <Input
                  id="groomPhoto"
                  placeholder="Upload or paste image URL"
                  className="mt-2"
                  data-testid="input-groom-photo"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="heroImage">Hero Background Image URL</Label>
              <Input
                id="heroImage"
                placeholder="Upload or paste image URL"
                className="mt-2"
                data-testid="input-hero-image"
              />
            </div>

            <Button className="w-full md:w-auto" data-testid="button-save-couple">
              <Save size={18} className="mr-2" />
              Save Changes
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
