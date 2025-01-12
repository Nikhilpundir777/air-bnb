import { useState } from "react";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Search, Users } from "lucide-react";

const popularCities = [
  "Mumbai, Maharashtra",
  "Delhi, NCR",
  "Bangalore, Karnataka",
  "Goa",
  "Jaipur, Rajasthan",
  "Chennai, Tamil Nadu",
  "Kolkata, West Bengal",
  "Pune, Maharashtra",
];

const SearchModal = ({ isOpen, onClose, onSearch }) => {
  const [location, setLocation] = useState("");
  const [dates, setDates] = useState({
    from: new Date(),
    to: new Date(),
  });
  const [guests, setGuests] = useState({
    adults: 1,
    children: 0,
  });

  const handleSearch = () => {
    onSearch({
      location,
      dates,
      guests,
    });
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Search Properties</DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Location Search */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Where</label>
            <Input
              placeholder="Search destinations"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="w-full"
            />
            <div className="grid grid-cols-2 gap-2 mt-2">
              {popularCities.map((city) => (
                <Button
                  key={city}
                  variant="outline"
                  className="text-sm"
                  onClick={() => setLocation(city)}
                >
                  {city}
                </Button>
              ))}
            </div>
          </div>

          {/* Date Selection */}
          <div className="space-y-2">
            <label className="text-sm font-medium">When</label>
            <div className="flex justify-center border rounded-lg p-4">
              <Calendar
                mode="range"
                selected={{
                  from: dates.from,
                  to: dates.to,
                }}
                onSelect={(range) => {
                  if (range?.from && range?.to) {
                    setDates({ from: range.from, to: range.to });
                  }
                }}
                numberOfMonths={2}
                className="rounded-md"
              />
            </div>
          </div>

          {/* Guests Selection */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Who</label>
            <div className="flex gap-4">
              <div className="flex-1">
                <Select
                  value={guests.adults.toString()}
                  onValueChange={(value) =>
                    setGuests({ ...guests, adults: parseInt(value) })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Adults" />
                  </SelectTrigger>
                  <SelectContent>
                    {[1, 2, 3, 4, 5, 6].map((num) => (
                      <SelectItem key={num} value={num.toString()}>
                        {num} Adults
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex-1">
                <Select
                  value={guests.children.toString()}
                  onValueChange={(value) =>
                    setGuests({ ...guests, children: parseInt(value) })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Children" />
                  </SelectTrigger>
                  <SelectContent>
                    {[0, 1, 2, 3, 4].map((num) => (
                      <SelectItem key={num} value={num.toString()}>
                        {num} Children
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          <Button
            className="w-full bg-airbnb-primary hover:bg-airbnb-primary/90"
            onClick={handleSearch}
          >
            <Search className="mr-2 h-4 w-4" />
            Search
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SearchModal;