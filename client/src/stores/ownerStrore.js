import { defineStore } from "pinia";
import {
  fetchOwners,
  createOwner,
  deleteOwner,
} from "../services/ownerService";

export const useOwnerStore = defineStore("ownerStore", {
  state: () => ({
    owners: [],
    selectedOwner: null,
    isLoading: false,
    error: null,
  }),
  actions: {
    // fetch all owners from api
    async loadOwners() {
      this.isLoading = true;
      try {
        this.owners = await fetchOwners();
      } catch (error) {
        this.error = "Failed to load owners.";
        console.error(error);
      } finally {
        this.isLoading = false;
      }
    },
    // create a new owner
    async addOwner(newOwner) {
      try {
        const createdOwner = await createOwner(newOwner);
        this.owners.push(createdOwner);
      } catch (error) {
        this.error = "Failed to load owners.";
        console.error(error);
      }
    },
    // need to create Update owner
    // Delete owner
    async removeOwner(id) {
      try {
        await deleteOwner(id);
        this.owners = this.owners.filter((owner) => owner._id !== id);
      } catch (error) {
        this.error = "Failed to delete owner.";
        console.error(error);
      }
    },
    selectedOwner(owner) {
      this.selectedOwner = owner;
    }
  },
});
