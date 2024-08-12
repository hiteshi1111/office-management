const Department = require("../schemas/department.schema");
const Role = require("../schemas/role.schema");

let service = {}
service.createDepartment = createDepartment;
service.getDepartment = getDepartment;
service.getRoles = getRoles;
service.createDesignation = createDesignation;

async function createDepartment(title, adminId, roles) {
  try {
    const existingDepartment = await Department.findOne({ title: title, adminId: adminId });
    if (existingDepartment) {
      return Promise.reject(`Department already exists`)
    } else {
      const data = {
        title: title,
        adminId: adminId,
        isActive: true
      }
      const newDepartment = new Department(data)
      const department = await newDepartment.save()
      return await createRole(department._id, roles)
    }
  } catch (error) {
    console.log("Error saving department:", error);
    return Promise.reject({ error: "Error saving department" });
  }
}

async function createDesignation(deptId, adminId, roles) {
  try {
    const existingDepartment = await Department.findOne({ _id: deptId, adminId: adminId });
    if (!existingDepartment) {
      return Promise.reject(`Department not found`)
    } else {
      return await createRole(existingDepartment._id, roles)
    }
  }
  catch (error) {
    console.error("Error creating roles:", error);
    throw new Error("Error creating roles");
  }
}

async function createRole(id, roles) {
  try {
    const uniqueRoles = [...new Set(roles)];
    const departmentPromises = uniqueRoles.map(async (role) => {
      const existingRole = await Role.findOne({ title: role, departmentId: id });
      if (!existingRole) {

        const data = {
          title: role,
          departmentId: id,
          isActive: true
        };
        const newRole = new Role(data);
        return await newRole.save();
      }
      return null;

    });
    const departments = await Promise.all(departmentPromises);
    return departments;
  } catch (error) {
    console.log("Error creating roles:", error);
    return Promise.reject("Error creating roles")
  }
}

async function getDepartment(id) {
  try {
    const data = await Department.find({ adminId: id })
    return data.length > 0 ? data : []
  } catch (error) {
    console.log("Error retrieving Department data", error)
    return Promise.reject({ error: "Error retrieving Department data" })
  }
}

async function getRoles(id) {
  try {
    const data = await Role.find({ departmentId: id })
    return data.length > 0 ? data : []
  } catch (error) {
    console.log("Error retrieving Roles data", error)
    return Promise.reject({ error: "Error retrieving Roles data" })
  }
}

module.exports = service