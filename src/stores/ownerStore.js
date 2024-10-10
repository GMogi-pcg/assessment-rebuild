import { defineStore } from "pinia";
import {
  fetchOwners,
  createOwner,
  deleteOwner,
  updateOwner,
  uploadFiles,
} from "../services/ownerService";

export const useOwnerStore = defineStore("ownerStore", {
  state: () => ({
    owners: [],
    selectedOwner: null,
    isLoading: false,
    error: null,
    isModalVisible: false,
    selectedFileUrls: [],
    selectedOwnerName: "",
    selectedOwnerId: null,
  }),
  actions: {
    // fetch all owners from api
    async loadOwners() {
      this.isLoading = true;
      try {
        this.owners = await fetchOwners();
        console.log("Checking store", this.owners)
      } catch (error) {
        this.error = "Failed to load owners.";
        console.error(error);
      } finally {
        this.isLoading = false;
      }
    },
    // create a new owner
    async addOwner(newOwner, file) {
      try {
        const createdOwner = await createOwner(newOwner, file);
        this.owners.push(createdOwner);
      } catch (error) {
        if (
          error.message.includes(
            "An owner with same name and address already exists"
          )
        ) {
          alert("An owner with same name and address already exists");
        } else {
          this.error = "Failed to create owners.";
          console.error(error);
        }
      }
    },
    //  Update owner
    async saveOwner(id, updatedOwner, files = []) {
      try {
        if (files.length > 0) {
          const uploadedFileUrls = await uploadFiles(files);

          updatedOwner.fileUrls = uploadedFileUrls
            ? [...updatedOwner.fileUrls, ...uploadedFileUrls]
            : updatedOwner.fileUrls;
        }
        const savedOwner = await updateOwner(id, updatedOwner);
        this.owners = this.owners.map((owner) =>
          owner._id === id ? savedOwner : owner
        );
        console.log("I am in the store",this.owners)
      } catch (error) {
        this.error = "Failed to update owner.";
        console.error(error);
      }
    },

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

    openFileModal(owner) {
      this.selectedFileUrls = owner.fileUrls || [];
      this.selectedOwnerName = owner.name;
      this.selectedOwnerId = owner._id;
      this.isModalVisible = true;
    },

    closeFileModal() {
      this.isModalVisible = false;
      // this.selectedFileUrls = [];
      // this.selectedOwnerName = "";
      // this.selectedOwnerId = null;
    },
    // Delete file
    // async removeFile(ownerId, fileUrl) {
    //   try {
    //     await deleteFile(ownerId, fileUrl);
    //     const owner = this.owners.find((owner) => owner._id === ownerId);

    //     if (owner) {
    //       owner.fileUrls = owner.fileUrls.filter((url) => url !== fileUrl);

    //     }
    //   } catch (error) {
    //     this.error = "Failed to delete file.";
    //     console.error(error);
    //   }
    // },


    selectOwner(owner) {
      this.selectedOwner = owner;
    },
  },
});
