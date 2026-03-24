/**
 * 🍱 Mumbai ka Dabbawala Service - ES6 Classes
 *
 * Mumbai ke famous dabbawala system ko ab modern ES6 class mein likho!
 * Har din hazaaron dabbas deliver hote hain aur ek bhi galat nahi jaata.
 * Tumhe DabbaService class banana hai jo customers manage kare, delivery
 * batches banaye, aur daily reports generate kare.
 *
 * Class: DabbaService
 *
 *   constructor(serviceName, area)
 *     - this.serviceName = serviceName
 *     - this.area = area
 *     - this.customers = [] (internal array)
 *     - this._nextId = 1 (auto-increment counter)
 *
 *   addCustomer(name, address, mealPreference)
 *     - mealPreference must be one of: "veg", "nonveg", "jain"
 *     - Agar invalid preference, return null
 *     - Agar name already exists (duplicate), return null
 *     - Creates customer: { id: auto-increment, name, address, mealPreference,
 *       active: true, delivered: false }
 *     - Pushes to this.customers
 *     - Returns the customer object
 *
 *   removeCustomer(name)
 *     - Sets customer's active to false (soft delete)
 *     - Returns true if found and deactivated
 *     - Returns false if not found or already inactive
 *
 *   createDeliveryBatch()
 *     - Returns array of delivery objects for all ACTIVE customers
 *     - Each delivery: { customerId: id, name, address, mealPreference,
 *       batchTime: new Date().toISOString() }
 *     - Resets delivered to false for all active customers before creating batch
 *     - Returns empty array if no active customers
 *
 *   markDelivered(customerId)
 *     - Finds active customer by id, sets delivered to true
 *     - Returns true if found and marked
 *     - Returns false if not found or not active
 *
 *   getDailyReport()
 *     - Returns report object for ACTIVE customers only:
 *       {
 *         totalCustomers: number (active only),
 *         delivered: number (active and delivered === true),
 *         pending: number (active and delivered === false),
 *         mealBreakdown: { veg: count, nonveg: count, jain: count }
 *       }
 *     - mealBreakdown counts active customers only
 *
 *   getCustomer(name)
 *     - Returns customer object by name (including inactive)
 *     - Returns null if not found
 *
 * Rules:
 *   - Use ES6 class syntax (not constructor functions)
 *   - Customer ids auto-increment starting from 1
 *   - No duplicate customer names allowed
 *   - removeCustomer is a soft delete (active: false), not actual removal
 *   - getDailyReport only counts active customers
 *   - mealPreference must be exactly "veg", "nonveg", or "jain"
 *
 * @example
 *   const service = new DabbaService("Raju Dabba", "Dadar");
 *   service.addCustomer("Amit", "Andheri West", "veg");
 *   // => { id: 1, name: "Amit", address: "Andheri West", mealPreference: "veg", active: true, delivered: false }
 *   service.addCustomer("Priya", "Bandra East", "jain");
 *   // => { id: 2, ... }
 *   service.createDeliveryBatch();
 *   // => [{ customerId: 1, name: "Amit", ... }, { customerId: 2, name: "Priya", ... }]
 *   service.markDelivered(1);       // => true
 *   service.getDailyReport();
 *   // => { totalCustomers: 2, delivered: 1, pending: 1, mealBreakdown: { veg: 1, nonveg: 0, jain: 1 } }
 */
export class DabbaService {
  constructor(serviceName, area) {
    // Your code here
    this.serviceName = serviceName;
    this.area = area;
    this.customers = [];
    this._nextId = 1;
  }

  addCustomer(name, address, mealPreference) {
    // Your code here
    if (
      mealPreference != "veg" &&
      mealPreference != "nonveg" &&
      mealPreference != "jain"
    ) {
      return null;
    }

    const found = this.customers.find((item) => item.name === name);
    if (found !== undefined) {
      return null;
    }

    const customer = {
      id: this._nextId++,
      name,
      address,
      mealPreference,
      active: true,
      delivered: false,
    };

    this.customers.push(customer);
    return customer;
  }

  removeCustomer(name) {
    // Your code here
    const found = this.customers.find((item) => item.name === name);
    if (found === undefined) {
      return false;
    }

    if (!found.active) {
      return false;
    }
    
    found.active = false;
    [...this.customers, found];
    return true;
  }

  createDeliveryBatch() {
    // Your code here
    let arr = [];

    for (let item of this.customers) {
      if (item.active) {
        let delivery = {
          customerId: item.id,
          name: item.name,
          address: item.address,
          mealPreference: item.mealPreference,
          batchTime: new Date().toISOString(),
        };
        item.delivered = false;
        arr.push(delivery);
      }
    }

    return arr;
  }

  markDelivered(customerId) {
    // Your code here
    const found = this.customers.find((item) => item.id === customerId);
    if (found === undefined || !found.active) {
      return false;
    }

    found.delivered = true;
    [...this.customers, found];
    return true;
  }

  getDailyReport() {
    // Your code here
    // let res = {
    //   totalCustomers: number (active only),
    //   delivered: number (active and delivered === true),
    //   pending: number (active and delivered === false),
    //   mealBreakdown: { veg: count, nonveg: count, jain: count }
    // }

    let res = {
      totalCustomers: 0,
      delivered: 0,
      pending: 0,
      mealBreakdown: {
        veg: 0, 
        nonveg: 0,
        jain: 0
      }
    }

    for (const item of this.customers) {
      if (!item.active) {
        continue;
      }
      if (item.active) {
        res.totalCustomers++;
      }
      if (item.delivered && item.active) {
        res.delivered++;
      }
      if (!item.delivered && item.active) {
        res.pending++;
      }
      if (item.mealPreference == "veg") {
        res.mealBreakdown.veg++;
      }
      if (item.mealPreference == "nonveg") {
        res.mealBreakdown.nonveg++;
      }
      if (item.mealPreference == "jain") {
        res.mealBreakdown.jain++;
      }
    }

    return res;
  }

  getCustomer(name) {
    // Your code here
    const found = this.customers.find((item) => item.name === name);
    if (found === undefined) {
      return null;
    }

    return found;
  }
}
