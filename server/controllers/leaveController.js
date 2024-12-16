const Leave = require('../models/Leave');
const User = require('../models/User');

// Créer une nouvelle demande de congé
exports.createLeave = async (req, res) => {
  try {
    const { type, startDate, endDate, reason } = req.body;
    
    const newLeave = new Leave({
      user: req.user._id,
      type,
      startDate,
      endDate,
      reason
    });

    const savedLeave = await newLeave.save();
    await savedLeave.populate('user', 'username firstName lastName');
    
    res.status(201).json(savedLeave);
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la création de la demande de congé', error: error.message });
  }
};

// Obtenir toutes les demandes de congés (avec filtres pour les managers)
exports.getLeaves = async (req, res) => {
  try {
    const { status, startDate, endDate, type } = req.query;
    const filter = {};

    // Si l'utilisateur n'est pas admin/manager, il ne voit que ses propres demandes
    if (req.user.role === 'user') {
      filter.user = req.user._id;
    }

    // Appliquer les filtres si présents
    if (status) filter.status = status;
    if (type) filter.type = type;
    if (startDate || endDate) {
      filter.startDate = {};
      if (startDate) filter.startDate.$gte = new Date(startDate);
      if (endDate) filter.startDate.$lte = new Date(endDate);
    }

    const leaves = await Leave.find(filter)
      .populate('user', 'username firstName lastName')
      .populate('approvedBy', 'username firstName lastName')
      .sort({ createdAt: -1 });

    res.json(leaves);
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la récupération des congés', error: error.message });
  }
};

// Obtenir une demande de congé spécifique
exports.getLeaveById = async (req, res) => {
  try {
    const leave = await Leave.findById(req.params.id)
      .populate('user', 'username firstName lastName')
      .populate('approvedBy', 'username firstName lastName')
      .populate('comments.user', 'username firstName lastName');

    if (!leave) {
      return res.status(404).json({ message: 'Demande de congé non trouvée' });
    }

    // Vérifier que l'utilisateur a le droit de voir cette demande
    if (req.user.role === 'user' && leave.user._id.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Accès non autorisé' });
    }

    res.json(leave);
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la récupération de la demande', error: error.message });
  }
};

// Mettre à jour le statut d'une demande de congé
exports.updateLeaveStatus = async (req, res) => {
  try {
    const { status, comment } = req.body;
    const leaveId = req.params.id;

    // Vérifier que l'utilisateur est admin ou manager
    if (!['admin', 'manager'].includes(req.user.role)) {
      return res.status(403).json({ message: 'Non autorisé à modifier le statut' });
    }

    const leave = await Leave.findById(leaveId);
    if (!leave) {
      return res.status(404).json({ message: 'Demande de congé non trouvée' });
    }

    // Mettre à jour le statut
    leave.status = status;
    leave.approvedBy = req.user._id;
    leave.approvalDate = new Date();

    // Ajouter un commentaire si fourni
    if (comment) {
      leave.comments.push({
        user: req.user._id,
        text: comment
      });
    }

    const updatedLeave = await leave.save();
    await updatedLeave.populate('user', 'username firstName lastName');
    await updatedLeave.populate('approvedBy', 'username firstName lastName');
    await updatedLeave.populate('comments.user', 'username firstName lastName');

    res.json(updatedLeave);
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la mise à jour du statut', error: error.message });
  }
};

// Ajouter un commentaire à une demande de congé
exports.addComment = async (req, res) => {
  try {
    const { text } = req.body;
    const leaveId = req.params.id;

    const leave = await Leave.findById(leaveId);
    if (!leave) {
      return res.status(404).json({ message: 'Demande de congé non trouvée' });
    }

    leave.comments.push({
      user: req.user._id,
      text
    });

    const updatedLeave = await leave.save();
    await updatedLeave.populate('comments.user', 'username firstName lastName');

    res.json(updatedLeave);
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de l\'ajout du commentaire', error: error.message });
  }
};

// Supprimer une demande de congé
exports.deleteLeave = async (req, res) => {
  try {
    const leave = await Leave.findById(req.params.id);
    
    if (!leave) {
      return res.status(404).json({ message: 'Demande de congé non trouvée' });
    }

    // Vérifier que l'utilisateur est autorisé à supprimer
    if (req.user.role === 'user' && leave.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Non autorisé à supprimer cette demande' });
    }

    // Ne peut pas supprimer une demande approuvée
    if (leave.status === 'approuvé') {
      return res.status(400).json({ message: 'Impossible de supprimer une demande approuvée' });
    }

    await leave.deleteOne();
    res.json({ message: 'Demande de congé supprimée avec succès' });
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la suppression', error: error.message });
  }
}; 