// src/pages/pots/PotsPage.jsx
import { useState, useEffect } from 'react'; // State kullanmak için import et
import './PotsPage.css';
import PotCard from '../../components/pots/PotCard.jsx';
import Modal from '../../components/modal/Modal.jsx'; // Existing import
import AddPotForm from '../../components/pots/AddPotForm.jsx'; // Existing import
import AddMoneyForm from '../../components/pots/AddMoneyForm.jsx'; // Existing import
import WithdrawMoneyForm from '../../components/pots/WithdrawMoneyForm.jsx'; // <-- 1. Withdraw Formunu Import Et
import EmptyState from '../../components/emptystate/EmptyState.jsx'; // Existing import
import emptyPotsImage from '../../assets/empty-pots.png'; // <-- YOLU KONTROL ET
import DeleteConfirmationModal from '../../components/modal/DeleteConfirmationModal.jsx'

const PotsPage = () => {
  // Verileri tutan state (Mevcut)
  const [pots, setPots] = useState([]);
  const [potActionError, setPotActionError] = useState({ potId: null, message: '' });
  const [openOptionsMenuId, setOpenOptionsMenuId] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  

  // Add Pot Modal State'i (Mevcut)
  const [isAddPotModalOpen, setIsAddPotModalOpen] = useState(false); // Adı daha açıklayıcı yaptık
  
  // Add Money Modal State'leri (Mevcut)
  const [isAddMoneyModalOpen, setIsAddMoneyModalOpen] = useState(false);
  const [selectedPot, setSelectedPot] = useState(null); // Ortak kullanılacak

  // <-- 2. Withdraw Modal State'ini Ekle -->
  const [isWithdrawModalOpen, setIsWithdrawModalOpen] = useState(false);
  // <-- Bitiş -->

  // Yeni Pot Oluşturma (Mevcut)
  const handleCreatePot = (newPotData) => {
    const newPot = {
      id: Date.now(), name: newPotData.name, saved: 0,
      target: newPotData.target, theme: newPotData.theme,
    };
    setPots(prevPots => [newPot, ...prevPots]);
    setIsAddPotModalOpen(false);
  };

  const handleOptionsToggle = (potId) => {
  // Eğer tıklanan menü zaten açıksa kapat, değilse aç
  setOpenOptionsMenuId(prevId => (prevId === potId ? null : potId));
  };

  // "+ Add Money" Modalını Açma (Mevcut)
  const openAddMoneyModal = (potId) => {

    if (potActionError.potId === potId) {
      setPotActionError({ potId: null, message: '' });
    }
    
    const potToEdit = pots.find(p => p.id === potId);
    if (potToEdit) {
      setSelectedPot(potToEdit);
      setIsAddMoneyModalOpen(true);
    }
  };

  // Para Ekleme İşlemini Onaylama (Mevcut)
  const handleConfirmAddition = (potId, amountToAdd) => {
    setPots(prevPots =>
      prevPots.map(pot => pot.id === potId ? { ...pot, saved: pot.saved + amountToAdd } : pot)
    );
    closeAddMoneyModal();
  };

  const closeAddMoneyModal = () => {
    setIsAddMoneyModalOpen(false);
    setSelectedPot(null);
  };

  // <-- 3. Withdraw Modal Fonksiyonlarını Ekle -->
const openWithdrawModal = (potId) => {
    // Önceki console.log'u kaldırabiliriz
    const potToEdit = pots.find(p => p.id === potId);
    
    if (potToEdit) {
      // YENİ KONTROL: Eğer birikmiş para 0 veya daha az ise
      if (potToEdit.saved <= 0) {
        // Hata state'ini ayarla
        setPotActionError({ potId: potId, message: "Please add money first." });
        // Hata mesajını 3 saniye sonra otomatik olarak temizle
        setTimeout(() => {
          setPotActionError({ potId: null, message: '' });
        }, 2000); // 3000 milisaniye = 3 saniye
      } else {
        // Para varsa, normal şekilde modalı aç
        setSelectedPot(potToEdit);
        setIsWithdrawModalOpen(true);
      }
    }
  };

  const handleConfirmWithdrawal = (potId, amountToWithdraw) => {
    setPots(prevPots =>
      prevPots.map(pot =>
        pot.id === potId
          ? { ...pot, saved: Math.max(0, pot.saved - amountToWithdraw) } // Miktarı azalt
          : pot
      )
    );
    closeWithdrawModal();
  };

  const closeWithdrawModal = () => {
    setIsWithdrawModalOpen(false);
    setSelectedPot(null);
  };
  useEffect(() => {
    const handleClickOutside = (event) => {
      // Menü kontrolü (Aynı kaldı)
      if (openOptionsMenuId !== null && 
          !event.target.closest('.pot-options-btn') && 
          !event.target.closest('.pot-options-menu')) 
      {
        setOpenOptionsMenuId(null);
      }

      // YENİ KONTROL: Hata mesajı kontrolü
      // Eğer bir hata mesajı gösteriliyorsa (potId null değilse)
      // VE tıklanan yer hata mesajının gösterildiği kartın (.pot-card) kendisi DEĞİLSE
      if (potActionError.potId !== null && 
          !event.target.closest(`.pot-card[data-pot-id="${potActionError.potId}"]`)) 
      {
         // Hata mesajını temizle
         setPotActionError({ potId: null, message: '' });
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  // Bağımlılıklara potActionError'ı da ekleyelim ki state güncelken çalışsın
  }, [openOptionsMenuId, potActionError]);

  const openDeleteModal = (potId) => {
    const potToDelete = pots.find(p => p.id === potId);
    if (potToDelete) {
      setSelectedPot(potToDelete); // Silinecek pot'u seçili yap
      setIsDeleteModalOpen(true); // Silme modalını aç
      setOpenOptionsMenuId(null); // Açık olan options menüsünü kapat
    }
  };

  const handleDeletePot = (potId) => {
    // pots state'inden ilgili pot'u filtreleyerek çıkar
    setPots(prevPots => prevPots.filter(pot => pot.id !== potId));
    closeDeleteModal(); // Modalı kapat
  };
  
  const closeDeleteModal = () => {
    setIsDeleteModalOpen(false);
    setSelectedPot(null); // Seçili pot'u temizle
  };

  


  
  // <-- Bitiş -->

  return (
    <div className="page-container">
      <div className="page-header">
        <h1 className="page-title">Pots</h1>
        <button className="btn-primary" onClick={() => setIsAddPotModalOpen(true)}>
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
             // <-- 4. PotCard'a onWithdrawClick prop'unu ekle -->
            <PotCard
              key={pot.id}
              pot={pot}
              onAddMoneyClick={openAddMoneyModal}
              onWithdrawClick={openWithdrawModal} // <-- EKLENDİ
              potActionError={potActionError}
              onOptionsToggle={handleOptionsToggle}
              isOptionsMenuOpen={openOptionsMenuId === pot.id}
              onDeleteClick={openDeleteModal}
            />
          ))}
        </div>
      )}

      {/* Add New Pot Modal (Mevcut) */}
      <Modal isOpen={isAddPotModalOpen} onClose={() => setIsAddPotModalOpen(false)}>
        <AddPotForm
          onAddPot={handleCreatePot}
          onClose={() => setIsAddPotModalOpen(false)}
        />
      </Modal>

      {/* Add Money Modal (Mevcut - kontrolü güncelledik) */}
      {selectedPot && isAddMoneyModalOpen && (
          <Modal isOpen={isAddMoneyModalOpen} onClose={closeAddMoneyModal}>
            <AddMoneyForm
              pot={selectedPot}
              onConfirm={handleConfirmAddition}
              onClose={closeAddMoneyModal}
            />
          </Modal>
      )}

      {/* <-- 5. Withdraw Modal'ı Render Et --> */}
      {selectedPot && isWithdrawModalOpen && (
          <Modal isOpen={isWithdrawModalOpen} onClose={closeWithdrawModal}>
            <WithdrawMoneyForm
              pot={selectedPot}
              onConfirm={handleConfirmWithdrawal}
              onClose={closeWithdrawModal}
            />
          </Modal>
      )}


      {selectedPot && isDeleteModalOpen && (
        <Modal isOpen={isDeleteModalOpen} onClose={closeDeleteModal}>
          <DeleteConfirmationModal 
            potName={selectedPot.name}
            onConfirm={() => handleDeletePot(selectedPot.id)}
            onCancel={closeDeleteModal}
          />
        </Modal>
      )}

    </div>
  );
};

export default PotsPage;


