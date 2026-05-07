import React, { useState, useEffect } from "react";
import {
  IonPage,
  IonContent,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonButton,
  IonIcon,
  IonModal,
  IonToast,
  IonRefresher,
  IonRefresherContent,
  IonBackButton,
  IonButtons,
  IonSpinner,
  RefresherEventDetail,
} from "@ionic/react";
import {
  addOutline,
  createOutline,
  trashOutline,
  gridOutline,
  chevronBackOutline,
  closeOutline,
  checkmarkOutline,
  warningOutline,
} from "ionicons/icons";
import { Kategori } from "../../types";
import {
  getAll,
  create,
  update,
  remove,
  countMenu,
} from "../../services/kategori.service";
import "./KategoriPage.css";
import CustomToast from "../../components/CustomToast";

type DeleteStep = "idle" | "confirm1" | "confirm2";

const KategoriPage: React.FC = () => {
  const [list, setList] = useState<Kategori[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [editTarget, setEditTarget] = useState<Kategori | null>(null);
  const [inputName, setInputName] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  const [deleteTarget, setDeleteTarget] = useState<Kategori | null>(null);
  const [deleteMenuCount, setDeleteMenuCount] = useState(0);
  const [deleteStep, setDeleteStep] = useState<DeleteStep>("idle");

  const [toast, setToast] = useState({
    show: false,
    message: "",
    color: "success",
  });

  const showToast = (message: string, color = "success") => {
    setToast({ show: true, message, color });
  };

  const loadData = () => setList(getAll());

  useEffect(() => {
    loadData();
  }, []);

  const handleRefresh = (event: CustomEvent<RefresherEventDetail>) => {
    loadData();
    event.detail.complete();
  };

  const openAdd = () => {
    setEditTarget(null);
    setInputName("");
    setShowModal(true);
  };

  const openEdit = (item: Kategori) => {
    setEditTarget(item);
    setInputName(item.nama_kategori);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setInputName("");
    setEditTarget(null);
  };

  const handleSave = () => {
    if (!inputName.trim()) {
      showToast("Nama kategori wajib diisi.", "danger");
      return;
    }
    setIsSaving(true);
    setTimeout(() => {
      if (editTarget) {
        update(editTarget.id, { nama_kategori: inputName });
        showToast("Kategori berhasil diubah.");
      } else {
        create({ nama_kategori: inputName });
        showToast("Kategori berhasil ditambahkan.");
      }
      loadData();
      closeModal();
      setIsSaving(false);
    }, 300);
  };

  const handleDeletePress = (item: Kategori) => {
    const count = countMenu(item.id);
    setDeleteTarget(item);
    setDeleteMenuCount(count);
    setDeleteStep("confirm1");
  };

  const handleDeleteConfirm1 = () => {
    if (deleteMenuCount > 0) {
      setDeleteStep("confirm2");
    } else {
      doDelete();
    }
  };

  const doDelete = () => {
    if (!deleteTarget) return;
    remove(deleteTarget.id);
    showToast(`Kategori "${deleteTarget.nama_kategori}" dihapus.`, "success");
    loadData();
    resetDelete();
  };

  const resetDelete = () => {
    setDeleteTarget(null);
    setDeleteMenuCount(0);
    setDeleteStep("idle");
  };

  const isDeleteOpen = deleteStep === "confirm1" || deleteStep === "confirm2";

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar className="kategori-toolbar">
          <IonButtons slot="start">
            <IonBackButton
              defaultHref="/owner/dashboard"
              icon={chevronBackOutline}
              text=""
            />
          </IonButtons>
          <IonTitle>Kelola Kategori</IonTitle>
          <IonButtons slot="end">
            <IonButton onClick={openAdd} className="add-btn">
              <IonIcon icon={addOutline} slot="icon-only" />
            </IonButton>
          </IonButtons>
        </IonToolbar>
      </IonHeader>

      <IonContent className="kategori-content">
        <IonRefresher slot="fixed" onIonRefresh={handleRefresh}>
          <IonRefresherContent />
        </IonRefresher>

        {/* Empty State */}
        {list.length === 0 && (
          <div className="empty-state">
            <IonIcon icon={gridOutline} />
            <h3>Belum ada kategori</h3>
            <p>Tambahkan kategori untuk mengelompokkan menu warung Anda.</p>
            <IonButton onClick={openAdd} className="empty-add-btn" size="small">
              <IonIcon icon={addOutline} slot="start" />
              Tambah Kategori
            </IonButton>
          </div>
        )}

        {/* List */}
        {list.length > 0 && (
          <div className="kategori-list">
            {list.map((item) => {
              const jumlahMenu = countMenu(item.id);
              return (
                <div key={item.id} className="kategori-item">
                  <div className="kategori-icon-wrap">
                    <IonIcon icon={gridOutline} />
                  </div>
                  <div className="kategori-info">
                    <div className="kategori-name">{item.nama_kategori}</div>
                    <div className="kategori-sub">{jumlahMenu} menu</div>
                  </div>
                  <div className="kategori-actions">
                    <button
                      className="action-btn edit"
                      onClick={() => openEdit(item)}
                    >
                      <IonIcon icon={createOutline} />
                    </button>
                    <button
                      className="action-btn delete"
                      onClick={() => handleDeletePress(item)}
                    >
                      <IonIcon icon={trashOutline} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* ---- MODAL TAMBAH / EDIT ---- */}
        <IonModal
          isOpen={showModal}
          onDidDismiss={closeModal}
          breakpoints={[0, 0.45]}
          initialBreakpoint={0.45}
          className="kategori-modal"
        >
          <IonContent>
            <div className="modal-handle" />
            <div className="modal-body">
              <div className="modal-header">
                <h3>{editTarget ? "Edit Kategori" : "Tambah Kategori"}</h3>
                <button className="modal-close" onClick={closeModal}>
                  <IonIcon icon={closeOutline} />
                </button>
              </div>

              <div className="modal-field">
                <label className="modal-label">Nama Kategori</label>
                <div className="modal-input-wrap">
                  <input
                    type="text"
                    value={inputName}
                    onChange={(e) => setInputName(e.target.value)}
                    placeholder="contoh: Minuman, Makanan Berat..."
                    className="modal-input-native"
                    autoFocus
                    onKeyDown={(e) => e.key === "Enter" && handleSave()}
                  />
                </div>
              </div>

              <IonButton
                expand="block"
                className="modal-save-btn"
                onClick={handleSave}
                disabled={isSaving}
              >
                {isSaving ? (
                  <IonSpinner name="crescent" />
                ) : (
                  <>
                    <IonIcon icon={checkmarkOutline} slot="start" />
                    {editTarget ? "Simpan Perubahan" : "Tambah Kategori"}
                  </>
                )}
              </IonButton>
            </div>
          </IonContent>
        </IonModal>

        {/* ---- OVERLAY KONFIRMASI HAPUS ---- */}
        {isDeleteOpen && (
          <div className="delete-overlay" onClick={resetDelete}>
            <div className="delete-card" onClick={(e) => e.stopPropagation()}>
              {/* Icon */}
              <div
                className={`delete-card-icon ${
                  deleteStep === "confirm2" || deleteMenuCount === 0
                    ? "danger"
                    : "warning"
                }`}
              >
                <IonIcon
                  icon={
                    deleteStep === "confirm2" || deleteMenuCount === 0
                      ? trashOutline
                      : warningOutline
                  }
                />
              </div>

              {/* Title */}
              <h3 className="delete-card-title">
                {deleteStep === "confirm2"
                  ? "Konfirmasi Akhir"
                  : deleteMenuCount > 0
                  ? "Perhatian"
                  : "Hapus Kategori"}
              </h3>

              {/* Message */}
              <p className="delete-card-message">
                {deleteStep === "confirm2" ? (
                  <>
                    Semua <strong>{deleteMenuCount} menu</strong> di kategori{" "}
                    <strong>"{deleteTarget?.nama_kategori}"</strong> akan ikut
                    terhapus dan <strong>tidak bisa dikembalikan</strong>.
                    Yakin?
                  </>
                ) : deleteMenuCount > 0 ? (
                  <>
                    Kategori <strong>"{deleteTarget?.nama_kategori}"</strong>{" "}
                    memiliki <strong>{deleteMenuCount} menu</strong>. Lanjutkan
                    hapus?
                  </>
                ) : (
                  <>
                    Hapus kategori{" "}
                    <strong>"{deleteTarget?.nama_kategori}"</strong>?
                  </>
                )}
              </p>

              {/* Actions */}
              <div className="delete-card-actions">
                <button className="delete-btn cancel" onClick={resetDelete}>
                  Batal
                </button>
                <button
                  className={`delete-btn confirm ${
                    deleteStep === "confirm2" || deleteMenuCount === 0
                      ? "danger"
                      : "warning"
                  }`}
                  onClick={
                    deleteStep === "confirm2" ? doDelete : handleDeleteConfirm1
                  }
                >
                  {deleteStep === "confirm2"
                    ? "Ya, Hapus Semua"
                    : deleteMenuCount > 0
                    ? "Lanjutkan"
                    : "Hapus"}
                </button>
              </div>
            </div>
          </div>
        )}
      </IonContent>
      <CustomToast
        show={toast.show}
        message={toast.message}
        color={toast.color as any}
        duration={2500}
        onDidDismiss={() => setToast({ ...toast, show: false })}
      />
    </IonPage>
  );
};

export default KategoriPage;
