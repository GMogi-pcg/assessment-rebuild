import * as Realm from "realm-web";

export class LandHoldings {
  constructor({
    name,
    owner = null,
    legalEntity,
    netMineralAcres,
    mineralOwnerRoyalty,
    sectionName,
    section,
    township,
    range,
    titleSource,
    files = [],
  }) {
    // Ensure owner is a valid ObjectId or null
    if (owner && typeof owner === 'object' && owner._id) {
      this.owner = new Realm.BSON.ObjectId(owner._id); // Handle Vue Proxy object
    } else if (typeof owner === 'string') {
      this.owner = new Realm.BSON.ObjectId(owner); // Handle string format
    } else {
      this.owner = owner ? new Realm.BSON.ObjectId(owner) : null; // Fallback to null
    }

    // Log incoming data to ensure constructor is receiving data
    console.log("Instantiating LandHoldings with data:", {
      name,
      owner,
      legalEntity,
      netMineralAcres,
      mineralOwnerRoyalty,
      sectionName,
      section,
      township,
      range,
      titleSource,
      files,
    });

    this.name = name || `${sectionName}-${legalEntity}`;
    this.owner = owner ? new Realm.BSON.ObjectId(owner) : null;
    this.legalEntity = legalEntity;
    this.netMineralAcres = netMineralAcres;
    this.mineralOwnerRoyalty = mineralOwnerRoyalty;
    this.sectionName = sectionName || `${section}-${township}-${range}`;
    this.section = section;
    this.township = township;
    this.range = range;
    this.titleSource = titleSource;
    this.files = files;
  }

  // client side validation
  isValid() {
    const titleSource = ["Class A", "Class B", "Class C", "Class D"];

    const isValidSection = /^[0-9]{3}$/.test(this.section);
    const isValidTownship = /^[0-9]{3}[NS]$/.test(this.township);
    const isValidRange = /^[0-9]{3}[EW]$/.test(this.range);

    // Logging each field for debugging
    console.log("Validating land holding:");
    console.log("Name:", this.name);
    console.log("Legal Entity:", this.legalEntity);
    console.log("Section:", this.section, "Valid:", isValidSection);
    console.log("Township:", this.township, "Valid:", isValidTownship);
    console.log("Range:", this.range, "Valid:", isValidRange);
    console.log("Title Source:", this.titleSource);

    return (
      typeof this.name === "string" &&
      this.name.trim().length > 0 &&
      typeof this.legalEntity === "string" &&
      this.legalEntity.trim().length > 0 &&
      typeof this.netMineralAcres === "number" &&
      this.netMineralAcres >= 0 &&
      typeof this.mineralOwnerRoyalty === "number" &&
      this.mineralOwnerRoyalty >= 0 &&
      typeof this.section === "string" &&
      isValidSection &&
      isValidTownship &&
      isValidRange &&
      titleSource.includes(this.titleSource)
    );
  }

  // conver instance into MongoDB document
  toMongoDocument() {
    return {
      name: `${this.sectionName}-${this.legalEntity}`,
      owner: this.owner ? this.owner : null,
      legalEntity: this.legalEntity,
      netMineralAcres: this.netMineralAcres,
      mineralOwnerRoyalty: this.mineralOwnerRoyalty,
      sectionName: `${this.section}-${this.township}-${this.range}`,
      section: this.section,
      township: this.township,
      range: this.range,
      titleSource: this.titleSource,
      files: this.files,
    };
  }
}
