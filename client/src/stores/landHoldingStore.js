import { defineStore } from "pinia";
import {
  fetchLandHoldings,
  createLandHolding,
  deleteLandHolding,
  updateLandHolding,
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
        this.landHoldings = await fetchLandHoldings();
      } catch (error) {
        this.error = "Failed to load land holdings.";
        console.error(error);
      } finally {
        this.isLoading = false;
      }
    },

    // create a new land holding
    async addLandHolding(newLandHolding) {
      this.isLoading = true;
      try {
        console.log('Creating land holding with data from store',newLandHolding);
        const createdLandHolding = await createLandHolding(newLandHolding);
        console.log('Created land holding successfully',createdLandHolding);
        this.landHoldings.push(createdLandHolding);
      } catch (error) {
        this.error = "Failed to create land holding.";
        console.error('Error adding land',error);
      } finally {
        this.isLoading = false;
      }
    },
    // update land holding
    async saveLandHolding(id, updatedLandHolding) {
      try {
        const savedLandHolding = await updateLandHolding(
          id,
          updatedLandHolding
        );
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
