export const RoleSwitch = (value: string) => {
    switch (value.toLowerCase()) {
        case "hyper-hyper":
            return "Super Admin";
        case "hyper":
            return "Admin";
        case "super-super":
            return "Super Master";
        case "master":
            return "Agent"
        case "super-master":
            return "Master"
        case "admin":
            return "Admin";
            case "owner_admin":
                return "Owner Admin"
                default:
            return "User"
    }
}





