export class Owner {
  constructor({
    name,
    entityType,
    ownerType,
    address,
    totalLandHoldings = 0,
    files = [],
  }) {
    this.name = name;
    this.entityType = entityType;
    this.ownerType = ownerType;
    this.address = address;
    this.totalLandHoldings = totalLandHoldings;
    this.files = files;
  }

  // client side validation
  isValid() {
    const entityTypes = ["Company", "Individual", "Investor", "Trust"];
    const ownerTypes = ["Competitor", "Seller", "Investor", "Professional"];

    return (
      typeof this.name === "string" &&
      this.name.trim().length > 0 &&
      entityTypes.includes(this.entityType) &&
      ownerTypes.includes(this.ownerType) &&
      typeof this.address === "string" &&
      this.address.trim().length > 0
    );
  }

  toMongoDocument() {
    return {
      name: this.name,
      entityType: this.entityType,
      ownerType: this.ownerType,
      address: this.address,
      totalLandHoldings: this.totalLandHoldings,
      files: this.files,
    };
  }
}
