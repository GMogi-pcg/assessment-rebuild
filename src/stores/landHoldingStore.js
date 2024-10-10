import { defineStore } from "pinia";
import {
  fetchLandHoldings,
  getOwnerById,
  createLandHolding,
  deleteLandHolding,
  updateLandHolding,
  uploadFiles,
} from "../services/landHoldingService";

export const useLandHoldingStore = defineStore("landHoldingStore", {
  state: () => ({
    landHoldings: [],
    selectedLandHolding: null,
    isLoading: false,
    error: null,
  }),
  actions: {
    // fetch all land holdings from api
    async loadLandHoldings() {
      this.isLoading = true;
      try {
        const landHoldingWithOwners = await fetchLandHoldings();
        this.landHoldings = landHoldingWithOwners;
      } catch (error) {
        this.error = "Failed to load land holdings.";
        console.error(error);
      } finally {
        this.isLoading = false;
      }
    },

    // create a new land holding
    async addLandHolding(newLandHolding, file) {
      this.isLoading = true;

      try {
        console.log(
          "Creating land holding with data from store",
          newLandHolding
        );
        const createdLandHolding = await createLandHolding(
          newLandHolding,
          file
        );

        if (createdLandHolding.owner) {
          const ownerDetails = await getOwnerById(createdLandHolding.owner);
          createdLandHolding.owner = ownerDetails; 
        }

        console.log("Created land holding successfully", createdLandHolding);
        this.landHoldings.push(createdLandHolding);
      } catch (error) {
        this.error = "Failed to create land holding.";
        console.error("Error adding land", error);
      } finally {
        this.isLoading = false;
      }
    },
    // update land holding
    async saveLandHolding(id, updatedLandHolding, files = []) {
      try {
        if (files.length > 0) {
          const uploadedFileUrls = await uploadFiles(files);

          updatedLandHolding.fileUrls = uploadedFileUrls
            ? [...updatedLandHolding.fileUrls, ...uploadedFileUrls]
            : updatedLandHolding.fileUrls;
        }

        const savedLandHolding = await updateLandHolding(
          id,
          updatedLandHolding
        );

        // added this to see if I can fix bug
        if (savedLandHolding.owner) {
          const ownerDetails = await getOwnerById(savedLandHolding.owner);
          savedLandHolding.owner = ownerDetails;
        }


        this.landHoldings = this.landHoldings.map((landHolding) =>
          landHolding._id === id ? savedLandHolding : landHolding
        );
      } catch (error) {
        this.error = "Failed to update land holding.";
        console.error(error);
      }
    },
    // Delete land holding
    async removeLandHolding(id) {
      try {
        await deleteLandHolding(id);
        this.landHoldings = this.landHoldings.filter(
          (landHolding) => landHolding._id !== id
        );
      } catch (error) {
        this.error = "Failed to delete land holding.";
        console.error(error);
      }
    },

    // select land holding
    selectLandHolding(landHolding) {
      this.selectedLandHolding = landHolding;
    },
  },
});
