export class Owner {
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
    this.name = name;
    this.owner = owner ? new Realm.BSON.ObjectId(owner) : null;
    this.legalEntity = legalEntity;
    this.netMineralAcres = netMineralAcres;
    this.mineralOwnerRoyalty = mineralOwnerRoyalty;
    this.sectionName = sectionName;
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
    const isValidTownship = /^[0-9]{2}[NS]$/.test(this.township);
    const isValidRange = /^[0-9]{2}[EW]$/.test(this.range);

    return (
      typeof this.name === "string" &&
      this.name.trim().length > 0 &&
      typeof this.legalEntity === "string" &&
      this.legalEntity.trim().length > 0 &&
      typeof this.netMineralAcres === "number" &&
      this.netMineralAcres >= 0 &&
      typeof this.mineralOwnerRoyalty === "number" &&
      this.mineralOwnerRoyalty >= 0 &&
      typeof this.sectionName === "string" &&
      this.sectionName.trim().length > 0 &&
      isValidSection &&
      isValidTownship &&
      isValidRange &&
      titleSource.includes(this.titleSource)
    );
  }

  // conver instance into MongoDB document
  toMongoDocument() {
    return {
      name: this.name,
      owner: this.owner ? new Realm.BSON.ObjectId(this.owner) : null,
      legalEntity: this.legalEntity,
      netMineralAcres: this.netMineralAcres,
      mineralOwnerRoyalty: this.mineralOwnerRoyalty,
      sectionName: this.sectionName,
      section: this.section,
      township: this.township,
      range: this.range,
      titleSource: this.titleSource,
      files: this.files,
    };
  }
}
