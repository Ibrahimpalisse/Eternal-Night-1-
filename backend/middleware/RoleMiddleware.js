class RoleMiddleware {
    constructor() {
      this.roles = ['super_admin', 'admin', 'content_editor', 'author', 'user', 'blocked', 'author_suspended'];
    }
  
    // Méthode pour vérifier les rôles
    authorizeRoles(...roles) {
      return (req, res, next) => {
        if (!req.user || !roles.includes(req.user.role)) {
          return res.sendStatus(403); // Forbidden
        }
        next();
      };
    }
  
    // Méthode pour vérifier si un rôle est supérieur ou égal à un autre
    isRoleAtLeast(userRole, minimumRole) {
      const userRoleIndex = this.roles.indexOf(userRole);
      const minimumRoleIndex = this.roles.indexOf(minimumRole);
      
      // Plus l'indice est petit, plus le rôle est élevé (super_admin = 0)
      return userRoleIndex !== -1 && minimumRoleIndex !== -1 && userRoleIndex <= minimumRoleIndex;
    }
  
    // Méthode pour ajouter un nouveau rôle
    addRole(role) {
      if (!this.roles.includes(role)) {
        this.roles.push(role);
      }
    }
  }
  
  module.exports = new RoleMiddleware();