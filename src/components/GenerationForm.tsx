import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Check, ChevronsUpDown, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Textarea } from "@/components/ui/textarea";
import { useEffect, useState } from "react";

const formSchema = z.object({
  artist: z.string().min(2).max(50),
  prompt: z.string().min(2),
});
const artists = [
  {
    value: "taylor-swift",
    label: "👸🏼 Taylor Swift",
  },
] as const;
const GenerationForm = () => {
  // 1. Define your form.
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      artist: "",
      prompt: "",
    },
  });
  const [song, setSong] = useState("");
  const [loading, setLoading] = useState(false);

  // 2. Define a submit handler.
  async function onSubmit(values: z.infer<typeof formSchema>) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    setLoading(true);

    const response = await fetch(
      `https://bhavyamuni-lirics.hf.space/${values.artist}?` +
        new URLSearchParams({
          query: values.prompt,
        }),
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    ).catch((error) => console.error("Error fetching data:", error));
    const data = await response?.json();
    setSong(data?.output);
  }

  useEffect(() => {
    form.setValue("prompt", song);
    setLoading(false);
  }, [song]);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 ">
        <FormField
          control={form.control}
          name="artist"
          render={({ field }) => (
            <FormItem>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant="outline"
                      role="combobox"
                      className={cn(
                        "w-[200px] justify-between",
                        !field.value && "text-muted-foreground"
                      )}
                    >
                      {field.value
                        ? artists.find((artist) => artist.value === field.value)
                            ?.label
                        : "Select artist"}
                      <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-[200px] p-0">
                  <Command>
                    <CommandInput placeholder="Search artist..." />
                    <CommandEmpty>No artist found.</CommandEmpty>
                    <CommandGroup>
                      {artists.map((artist) => (
                        <CommandItem
                          value={artist.label}
                          key={artist.value}
                          onSelect={() => {
                            form.setValue("artist", artist.value);
                          }}
                        >
                          <Check
                            className={cn(
                              "mr-2 h-4 w-4",
                              artist.value === field.value
                                ? "opacity-100"
                                : "opacity-0"
                            )}
                          />
                          {artist.label}
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </Command>
                </PopoverContent>
              </Popover>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="prompt"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Prompt</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Write the start of your new song..."
                  className="h-32"
                  disabled={loading}
                  {...field}
                />
              </FormControl>
              {/* <FormDescription>
                You can <span>@mention</span> other users and organizations.
              </FormDescription> */}
              <FormMessage />
            </FormItem>
          )}
        />
        {!loading ? (
          <Button type="submit">Generate</Button>
        ) : (
          <Button disabled>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Generating...
          </Button>
        )}
      </form>
    </Form>
  );
};

export default GenerationForm;
