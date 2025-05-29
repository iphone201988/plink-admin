import { useEffect, useState, useCallback } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import z from "zod";
import { useLoadScript, GoogleMap, Marker } from "@react-google-maps/api";
import { useAddCourtMutation } from "@/api";
import { toast } from "@/hooks/use-toast";

const libraries: ("places" | "marker")[] = ["places", "marker"];

interface CourtModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit?: (court: Partial<Court>) => void;
  court?: Court;
}

interface Court {
  title: string;
  description: string;
  phoneNumber: string;
  countryCode: string;
  websiteLink: string;
  latitude: number;
  longitude: number;
  net: "Portable" | "Permanent";
  surface: "Wood" | "Concrete" | "Asphalt" | "Acrylic";
  images: string[];
  address: string;
  courtCount: number;
  courtType: number;
  accessType: number;
  location: {
    type: string;
    coordinates: [number, number];
  };
}

const courtFormSchema = z.object({
  title: z.string().min(2, "Title must be at least 2 characters."),
  description: z.string().min(5, "Description must be at least 5 characters."),
  phoneNumber: z.string().regex(/^\d{10}$/, "Phone number must be 10 digits."),
  countryCode: z.string().regex(/^\d{1,3}$/, "Country code must be 1-3 digits."),
  websiteLink: z.string().url("Invalid URL format"),
  latitude: z.number().min(-90).max(90, "Latitude must be between -90 and 90"),
  longitude: z.number().min(-180).max(180, "Longitude must be between -180 and 180"),
  net: z.enum(["Portable", "Permanent"]),
  surface: z.enum(["Wood", "Concrete", "Asphalt", "Acrylic"]),
  address: z.string().min(5, "Address must be at least 5 characters."),
  courtCount: z.number().min(1, "Must have at least 1 court"),
  courtType: z.number().refine(value => [1, 2, 3, 4, 5, 6].includes(value), {
    message: "Must be a valid court type (1-6)",
  }),
  accessType: z.number().refine(value => [1, 2, 3].includes(value), {
    message: "Must be a valid access type (1-3)",
  }),
  images: z.array(z.string()).optional(),
});

type CourtFormValues = z.infer<typeof courtFormSchema>;

const mapContainerStyle = {
  width: "100%",
  height: "300px",
};

const defaultCenter = {
  lat: 30.7298,
  lng: 76.8021,
};

export function CourtModal({ isOpen, onClose, onSubmit, court }: CourtModalProps) {
  const [selectedImages, setSelectedImages] = useState<File[]>([]);
  const [markerPosition, setMarkerPosition] = useState<{ lat: number; lng: number } | null>(null);
  const [map, setMap] = useState<google.maps.Map | null>(null);

 const [addCourt] = useAddCourtMutation();

  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY || "AIzaSyC1BydibI3lXzAZ2xMpSK7C8pLQyjx9IeY",
    libraries,
  });

  const form = useForm<CourtFormValues>({
    resolver: zodResolver(courtFormSchema),
    defaultValues: {
      title: court?.title || "Sector 26 Indoor Pickleball new",
      description: court?.description || "Indoor courts for year-round pickleball in Sector 26.",
      phoneNumber: court?.phoneNumber || "9345678901",
      countryCode: court?.countryCode || "91",
      websiteLink: court?.websiteLink || "http://www.sector26pickleball.com",
      latitude: court?.latitude ?? 30.7298,
      longitude: court?.longitude ?? 76.8021,
      net: court?.net || "Portable",
      surface: court?.surface || "Wood",
      address: court?.address || "Sector 26, Chandigarh, India",
      courtCount: court?.courtCount || 4,
      courtType: court?.courtType || 4,
      accessType: court?.accessType || 3,
      images: court?.images || [],
    },
  });

  const onMapLoad = useCallback((mapInstance: google.maps.Map) => {
    setMap(mapInstance);
  }, []);

  const handleMapClick = useCallback(
    (event: google.maps.MapMouseEvent) => {
      if (!event.latLng) return;

      const lat = event.latLng.lat();
      const lng = event.latLng.lng();
      setMarkerPosition({ lat, lng });

      form.setValue("latitude", lat, { shouldValidate: true });
      form.setValue("longitude", lng, { shouldValidate: true });

      if (window.google) {
        const geocoder = new window.google.maps.Geocoder();
        geocoder.geocode({ location: { lat, lng } }, (results, status) => {
          if (status === "OK" && results?.[0]) {
            form.setValue("address", results[0].formatted_address, { shouldValidate: true });
          }
        });
      }
    },
    [form]
  );

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newImages = Array.from(e.target.files);
      setSelectedImages(prev => [...prev, ...newImages]);
    }
  };

  const removeImage = (index: number) => {
    setSelectedImages(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (values: CourtFormValues) => {
    const formData = new FormData();
  
    // Append form values to FormData
    formData.append("title", values.title);
    formData.append("description", values.description);
    formData.append("phoneNumber", values.phoneNumber);
    formData.append("countryCode", values.countryCode);
    formData.append("websiteLink", values.websiteLink);
    formData.append("latitude", values.latitude.toString());
    formData.append("longitude", values.longitude.toString());
    formData.append("net", values.net);
    formData.append("surface", values.surface);
    formData.append("address", values.address);
    formData.append("courtCount", values.courtCount.toString());
    formData.append("courtType", values.courtType.toString());
    formData.append("accessType", values.accessType.toString());
    formData.append("location[type]", "Point");
    formData.append("location[coordinates][0]", values.longitude.toString());
    formData.append("location[coordinates][1]", values.latitude.toString());
  
    // Append images to FormData
    selectedImages.forEach((image, index) => {
      formData.append("images", image, `court${index + 1}.png`);
    });
  
    try {
      // Assuming addCourt is configured to handle FormData
      await addCourt(formData).unwrap();
      toast({
        title: "Court created",
        description: "Court is created successfully",
        variant: "success",
      });
  
      // Call onSubmit with the original courtData for compatibility
      const courtData: Partial<Court> = {
        ...values,
        location: {
          type: "Point",
          coordinates: [values.longitude, values.latitude],
        },
        images: selectedImages.map((_, index) => `court${index + 1}.png`),
      };
      onSubmit?.(courtData);
      onClose();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create court. Please try again.",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    if (court) {
      form.reset({
        title: court.title,
        description: court.description,
        phoneNumber: court.phoneNumber,
        countryCode: court.countryCode,
        websiteLink: court.websiteLink,
        latitude: court.latitude,
        longitude: court.longitude,
        net: court.net,
        surface: court.surface,
        address: court.address,
        courtCount: court.courtCount,
        courtType: court.courtType,
        accessType: court.accessType,
        images: court.images,
      });
      setSelectedImages([]);
      setMarkerPosition(
        court.latitude && court.longitude
          ? { lat: court.latitude, lng: court.longitude }
          : null
      );
    }
  }, [court, form]);

  const handleNumberChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    onChange: (value: number) => void
  ) => {
    const value = e.target.value;
    const parsedValue = parseFloat(value);
    onChange(isNaN(parsedValue) ? 0 : parsedValue);
  };

  if (loadError) {
    return <div className="p-4 text-red-500">Error loading Google Maps. Please try again later.</div>;
  }

  if (!isLoaded) {
    return <div className="p-4">Loading Google Maps...</div>;
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{court ? "Edit Court" : "Add New Court"}</DialogTitle>
          <DialogDescription className="text-sm text-muted-foreground">
            Add or edit pickleball court details
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Title</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter court title" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter description" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="phoneNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Phone Number</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter phone number" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="countryCode"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Country Code</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter country code" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="websiteLink"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Website Link</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter website URL" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="address"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Selected Location Address</FormLabel>
                    <FormControl>
                      <Input placeholder="Click on the map to select a location" {...field} readOnly />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="space-y-4">
              <h4 className="text-sm font-medium">Select Location on Map</h4>
              <div className="h-[300px] w-full rounded-md overflow-hidden">
                <GoogleMap
                  mapContainerStyle={mapContainerStyle}
                  center={
                    markerPosition || (court?.latitude && court?.longitude)
                      ? { 
                          lat: court?.latitude || markerPosition?.lat || defaultCenter.lat, 
                          lng: court?.longitude || markerPosition?.lng || defaultCenter.lng 
                        }
                      : defaultCenter
                  }
                  zoom={15}
                  onClick={handleMapClick}
                  onLoad={onMapLoad}
                >
                  {(markerPosition || (court?.latitude && court?.longitude)) && (
                    <Marker
                      position={
                        markerPosition || 
                        { lat: court!.latitude, lng: court!.longitude }
                      }
                    />
                  )}
                </GoogleMap>
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="text-sm font-medium">Location Coordinates</h4>
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="latitude"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Latitude</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder="-90 to 90"
                          step={0.0001}
                          {...field}
                          value={field.value ?? ""}
                          readOnly
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="longitude"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Longitude</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder="-180 to 180"
                          step={0.0001}
                          {...field}
                          value={field.value ?? ""}
                          readOnly
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="text-sm font-medium">Images</h4>
              <div className="grid grid-cols-3 gap-4">
                <div className="relative">
                  <label
                    htmlFor="image-upload"
                    className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100"
                  >
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                      <svg
                        className="w-8 h-8 mb-2 text-gray-500"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M7 16V4m0 0L3 8m4-4l4-4m-8 8h14m-5 4v8m0-8H3m12 0h6"
                        />
                      </svg>
                      <p className="text-sm text-gray-500">Upload</p>
                    </div>
                    <Input
                      id="image-upload"
                      type="file"
                      accept="image/*"
                      multiple
                      className="hidden"
                      onChange={handleImageChange}
                    />
                  </label>
                </div>

                {selectedImages.map((image, index) => (
                  <div key={index} className="relative">
                    <div className="relative w-full h-32 rounded-lg overflow-hidden">
                      <img
                        src={URL.createObjectURL(image)}
                        alt={image.name}
                        className="w-full h-full object-cover"
                      />
                      <button
                        type="button"
                        onClick={() => removeImage(index)}
                        className="absolute top-1 right-1 bg-blue-500 text-white rounded-full w-6 h-6 flex items-center justify-center"
                      >
                        ✕
                      </button>
                    </div>
                    <p className="text-sm text-gray-500 mt-1 truncate">{image.name}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="text-sm font-medium">Court Details</h4>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <FormField
                  control={form.control}
                  name="net"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Net Type</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select net type" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="Portable">Portable</SelectItem>
                          <SelectItem value="Permanent">Permanent</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="surface"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Surface Type</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select surface type" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="Wood">Wood</SelectItem>
                          <SelectItem value="Concrete">Concrete</SelectItem>
                          <SelectItem value="Asphalt">Asphalt</SelectItem>
                          <SelectItem value="Acrylic">Acrylic</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="courtCount"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Court Count</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder="Number of courts"
                          min={1}
                          {...field}
                          onChange={(e) => handleNumberChange(e, field.onChange)}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="courtType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Court Type</FormLabel>
                      <Select
                        onValueChange={(value) => field.onChange(parseInt(value))}
                        defaultValue={field.value?.toString()}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select court type" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="1">Dedicated</SelectItem>
                          <SelectItem value="2">Reservable</SelectItem>
                          <SelectItem value="3">Lighted</SelectItem>
                          <SelectItem value="4">Indoor</SelectItem>
                          <SelectItem value="5">Outdoor</SelectItem>
                          <SelectItem value="6">Permanent lines</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="accessType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Access Type</FormLabel>
                      <Select
                        onValueChange={(value) => field.onChange(parseInt(value))}
                        defaultValue={field.value?.toString()}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select access type" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="1">No fee</SelectItem>
                          <SelectItem value="2">Fee</SelectItem>
                          <SelectItem value="3">Private</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <DialogFooter className="sticky bottom-0 bg-white pt-4">
              <Button type="button" variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button type="submit">
                {court ? "Save Changes" : "Add Court"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}