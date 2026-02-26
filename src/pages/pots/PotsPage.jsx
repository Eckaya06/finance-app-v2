import { useState, useEffect } from 'react';
import './PotsPage.css';
import PotCard from '../../components/pots/PotCard.jsx';
import Modal from '../../components/modal/Modal.jsx';
import AddPotForm from '../../components/pots/AddPotForm.jsx';
import EditPotForm from '../../components/pots/EditPotForm.jsx';
import AddMoneyForm from '../../components/pots/AddMoneyForm.jsx';
import WithdrawMoneyForm from '../../components/pots/WithdrawMoneyForm.jsx';
import EmptyState from '../../components/emptystate/EmptyState.jsx';
import emptyPotsImage from '../../assets/empty-pots.webp';
import DeleteConfirmationModal from '../../components/modal/DeleteConfirmationModal.jsx'
import { useTransactions } from '../../context/TransactionContext.jsx'; 

const PotsPage = () => {
  const { pots, addPot, deletePot, updatePotBalance, updatePot } = useTransactions();
  
  const [potActionError, setPotActionError] = useState({ potId: null, message: '' });
  const [openOptionsMenuId, setOpenOptionsMenuId] = useState(null);
  
  const [isAddPotModalOpen, setIsAddPotModalOpen] = useState(false);
  const [isAddMoneyModalOpen, setIsAddMoneyModalOpen] = useState(false);
  const [isWithdrawModalOpen, setIsWithdrawModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  
  const [isEditPotModalOpen, setIsEditPotModalOpen] = useState(false);
  const [selectedPot, setSelectedPot] = useState(null);

  // 🕵️ DEDEKTİF LOGU: Ekranda (State'lerde) neler oluyor?
  console.log("🔄 SAYFA RENDER EDİLDİ | Modal Durumları:", { 
    AddPot: isAddPotModalOpen, 
    Edit: isEditPotModalOpen, 
    AddMoney: isAddMoneyModalOpen, 
    SelectedPot: selectedPot?.name || "Yok" 
  });

  const handleCreatePot = async (newPotData) => {
    const newPot = { name: newPotData.name, saved: 0, target: newPotData.target, theme: newPotData.theme };
    await addPot(newPot); 
    setIsAddPotModalOpen(false);
  };

  const handleOptionsToggle = (potId) => {
    console.log(`🖱️ Üç Noktaya Tıklandı. Açılan Menü ID: ${potId}`);
    setOpenOptionsMenuId(prevId => (prevId === potId ? null : potId));
  };

  const openAddMoneyModal = (potId) => {
    console.log(`💰 Add Money Tıklandı! Pot ID: ${potId}`);
    if (potActionError.potId === potId) setPotActionError({ potId: null, message: '' });
    const potToEdit = pots.find(p => p.id === potId);
    if (potToEdit) {
      setSelectedPot(potToEdit);
      setIsAddMoneyModalOpen(true);
    } else {
      console.log("❌ Add Money için pot bulunamadı!");
    }
  };

  const handleConfirmAddition = async (potId, amountToAdd) => {
    const potToUpdate = pots.find(p => p.id === potId);
    if (potToUpdate) {
      const newBalance = potToUpdate.saved + amountToAdd;
      await updatePotBalance(potId, newBalance);
    }
    closeAddMoneyModal();
  };

  const closeAddMoneyModal = () => {
    setIsAddMoneyModalOpen(false);
    setSelectedPot(null);
  };

  const openWithdrawModal = (potId) => {
    console.log(`💸 Withdraw Tıklandı! Pot ID: ${potId}`);
    const potToEdit = pots.find(p => p.id === potId);
    if (potToEdit) {
      if (potToEdit.saved <= 0) {
        setPotActionError({ potId: potId, message: "Please add money first." });
        setTimeout(() => setPotActionError({ potId: null, message: '' }), 2000);
      } else {
        setSelectedPot(potToEdit);
        setIsWithdrawModalOpen(true);
      }
    }
  };

  const handleConfirmWithdrawal = async (potId, amountToWithdraw) => {
    const potToUpdate = pots.find(p => p.id === potId);
    if (potToUpdate) {
      const newBalance = Math.max(0, potToUpdate.saved - amountToWithdraw);
      await updatePotBalance(potId, newBalance);
    }
    closeWithdrawModal();
  };

  const closeWithdrawModal = () => {
    setIsWithdrawModalOpen(false);
    setSelectedPot(null);
  };

  const handleUpdatePot = async (potId, updatedData) => {
    await updatePot(potId, updatedData);
    setIsEditPotModalOpen(false);
    setSelectedPot(null);
  };

  const openEditModal = (potId) => {
    console.log(`✏️ Edit Pot Tıklandı! Pot ID: ${potId}`);
    const potToEdit = pots.find(p => p.id === potId);
    if (potToEdit) {
      setSelectedPot(potToEdit);
      setIsEditPotModalOpen(true);
      setOpenOptionsMenuId(null); 
    } else {
      console.log("❌ Edit için pot bulunamadı!");
    }
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      // 🕵️ DEDEKTİF LOGU: Ekran tıklamalarını dinliyoruz
      if (openOptionsMenuId !== null) {
        console.log("🖱️ Ekran dışı tıklama algılandı. Tıklanan yer:", event.target.className);
      }

      if (openOptionsMenuId !== null && 
          !event.target.closest('.pot-options-btn') && 
          !event.target.closest('.pot-options-menu')) 
      {
        setOpenOptionsMenuId(null);
      }
      if (potActionError.potId !== null && 
          !event.target.closest(`.pot-card[data-pot-id="${potActionError.potId}"]`)) 
      {
         setPotActionError({ potId: null, message: '' });
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [openOptionsMenuId, potActionError]);

  const openDeleteModal = (potId) => {
    console.log(`🗑️ Delete Pot Tıklandı! Pot ID: ${potId}`);
    const potToDelete = pots.find(p => p.id === potId);
    if (potToDelete) {
      setSelectedPot(potToDelete);
      setIsDeleteModalOpen(true);
      setOpenOptionsMenuId(null);
    }
  };

  const handleDeletePot = async (potId) => {
    await deletePot(potId);
    closeDeleteModal();
  };
  
  const closeDeleteModal = () => {
    setIsDeleteModalOpen(false);
    setSelectedPot(null);
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <h1 className="page-title">Pots</h1>
        {/* 🕵️ DEDEKTİF LOGU: Add Pot butonu tıklandığında log atar */}
        <button className="btn-primary" onClick={() => {
          console.log("➕ Add New Pot Butonuna Tıklandı!");
          setIsAddPotModalOpen(true);
        }}>
          + Add New Pot
        </button>
      </div>

      {pots.length === 0 ? (
        <EmptyState
          title="Create Your First Pot"
          message="'Pots' help you save for specific goals. Click the button below to create your first savings pot and start tracking your progress!"
          buttonText="+ Create First Pot"
          onAction={() => setIsAddPotModalOpen(true)}
          backgroundImage={emptyPotsImage}
        />
      ) : (
        <div className="pots-grid">
          {pots.map(pot => (
            <PotCard
              key={pot.id}
              pot={pot}
              onAddMoneyClick={openAddMoneyModal}
              onWithdrawClick={openWithdrawModal}
              potActionError={potActionError}
              onOptionsToggle={handleOptionsToggle}
              isOptionsMenuOpen={openOptionsMenuId === pot.id}
              onDeleteClick={openDeleteModal}
              onEditClick={openEditModal} 
            />
          ))}
        </div>
      )}

      {/* MODALS */}
      <Modal isOpen={isAddPotModalOpen} onClose={() => setIsAddPotModalOpen(false)}>
        <AddPotForm onAddPot={handleCreatePot} onClose={() => setIsAddPotModalOpen(false)} />
      </Modal>

      {selectedPot && isEditPotModalOpen && (
        <Modal isOpen={isEditPotModalOpen} onClose={() => { setIsEditPotModalOpen(false); setSelectedPot(null); }}>
          <EditPotForm pot={selectedPot} onUpdatePot={handleUpdatePot} onClose={() => { setIsEditPotModalOpen(false); setSelectedPot(null); }} />
        </Modal>
      )}

      {selectedPot && isAddMoneyModalOpen && (
          <Modal isOpen={isAddMoneyModalOpen} onClose={closeAddMoneyModal}>
            <AddMoneyForm pot={selectedPot} onConfirm={handleConfirmAddition} onClose={closeAddMoneyModal} />
          </Modal>
      )}

      {selectedPot && isWithdrawModalOpen && (
          <Modal isOpen={isWithdrawModalOpen} onClose={closeWithdrawModal}>
            <WithdrawMoneyForm pot={selectedPot} onConfirm={handleConfirmWithdrawal} onClose={closeWithdrawModal} />
          </Modal>
      )}

      {selectedPot && isDeleteModalOpen && (
        <Modal isOpen={isDeleteModalOpen} onClose={closeDeleteModal}>
          <DeleteConfirmationModal potName={selectedPot.name} onConfirm={() => handleDeletePot(selectedPot.id)} onCancel={closeDeleteModal} />
        </Modal>
      )}
    </div>
  );
};

export default PotsPage;


