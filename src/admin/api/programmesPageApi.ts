// src/admin/api/programmesPageApi.ts
import { supabase } from "../../utils/supabaseClient";
import {
  ProgrammesPageData,
  ProgrammesPageFormData,
} from "../programmesPageTypes";

export const programmesPageApi = {
  // Get programmes page data
  async getProgrammesPageData(): Promise<ProgrammesPageData | null> {
    try {
      console.log("Starting request for programmes page data from Supabase...");
      const { data, error } = await supabase
        .from("temp_programmes_page")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(1)
        .single();

      if (error) {
        // If no record exists, it's not an error for us - just no data
        if (error.code === "PGRST116") {
          console.log("No programmes page data found");
          return null;
        }
        console.error(
          "Supabase error when getting programmes page data:",
          error,
        );
        throw error;
      }

      console.log("Programmes page data received:", data);
      return data;
    } catch (e) {
      console.error("Unhandled error in getProgrammesPageData:", e);
      throw e;
    }
  },

  // Update/create programmes page data
  async updateProgrammesPageData(
    formData: ProgrammesPageFormData,
  ): Promise<ProgrammesPageData> {
    try {
      // First check if a record already exists
      const existingData = await this.getProgrammesPageData();

      if (existingData) {
        // Update existing record
        const { data, error } = await supabase
          .from("temp_programmes_page")
          .update(formData)
          .eq("id", existingData.id)
          .select()
          .single();

        if (error) {
          console.error("Error updating programmes page data:", error);
          throw error;
        }

        return data;
      } else {
        // Create a new record
        const { data, error } = await supabase
          .from("temp_programmes_page")
          .insert(formData)
          .select()
          .single();

        if (error) {
          console.error("Error creating programmes page data:", error);
          throw error;
        }

        return data;
      }
    } catch (e) {
      console.error("Unhandled error in updateProgrammesPageData:", e);
      throw e;
    }
  },

  // Upload image
  async uploadImage(file: File, folder: string): Promise<string> {
    try {
      if (!file) {
        throw new Error("No file provided");
      }

      const { data: user, error: userError } = await supabase.auth.getUser();
      if (!user) {
        console.error("User is not authenticated", userError);
        throw new Error("You must be logged in to upload files.");
      }

      const fileExt = file.name.split(".").pop();
      const fileName = `${Date.now()}.${fileExt}`;
      const filePath = `${folder}/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from("programmes")
        .upload(filePath, file, {
          contentType: file.type,
          upsert: true,
        });

      if (uploadError) {
        throw uploadError;
      }

      const { data } = supabase.storage
        .from("programmes")
        .getPublicUrl(filePath);

      return data.publicUrl;
    } catch (e) {
      console.error("Error uploading image:", e);
      throw e;
    }
  },
};
