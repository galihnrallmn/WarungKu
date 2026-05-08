import React, { useState, useEffect } from "react";
import {
  IonPage,
  IonContent,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonIcon,
  IonModal,
  IonToast,
  IonRefresher,
  IonRefresherContent,
  IonBackButton,
  IonButtons,
  IonButton,
  IonSpinner,
  RefresherEventDetail,
} from "@ionic/react";
import {
  addOutline,
  chevronBackOutline,
  closeOutline,
  checkmarkOutline,
  createOutline,
  trashOutline,
  peopleOutline,
  keyOutline,
  personOutline,
  mailOutline,
  lockClosedOutline,
} from "ionicons/icons";
import { User } from "../../types";
import {
  getKasirList,
  create,
  update,
  resetPassword,
  remove,
} from "../../services/user.service";
import "./UserPage.css";

type ModalMode = "add" | "edit" | "reset";

const UserPage: React.FC = () => {
  const [list, setList] = useState<User[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState<ModalMode>("add");
  const [editTarget, setEditTarget] = useState<User | null>(null);

  const [formName, setFormName] = useState("");
  const [formEmail, setFormEmail] = useState("");
  const [formPassword, setFormPassword] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  // Delete
  const [deleteTarget, setDeleteTarget] = useState<User | null>(null);

  const [toast, setToast] = useState({ show: false, message: "", color: "success" });
  const showToast = (message: string, color = "success") =>
    setToast({ show: true, message, color });

  const loadData = () => setList(getKasirList());

  useEffect(() => {
    loadData();
  }, []);

  const handleRefresh = (event: CustomEvent<RefresherEventDetail>) => {
    loadData();
    event.detail.complete();
  };

  // ---- Modal ----
  const openAdd = () => {
    setModalMode("add");
    setEditTarget(null);
    setFormName("");
    setFormEmail("");
    setFormPassword("");
    setShowModal(true);
  };

  const openEdit = (user: User) => {
    setModalMode("edit");
    setEditTarget(user);
    setFormName(user.name);
    setFormEmail(user.email);
    setFormPassword("");
    setShowModal(true);
  };

  const openReset = (user: User) => {
    setModalMode("reset");
    setEditTarget(user);
    setFormPassword("");
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditTarget(null);
    setFormName("");
    setFormEmail("");
    setFormPassword("");
  };

  const handleSave = () => {
    setIsSaving(true);
    setTimeout(() => {
      if (modalMode === "add") {
        if (!formName.trim()) { showToast("Nama wajib diisi.", "danger"); setIsSaving(false); return; }
        if (!formEmail.trim()) { showToast("Email wajib diisi.", "danger"); setIsSaving(false); return; }
        if (!formPassword.trim() || formPassword.length < 6) {
          showToast("Password minimal 6 karakter.", "danger"); setIsSaving(false); return;
        }
        const result = create({ name: formName, email: formEmail, password: formPassword, role: "kasir" });
        if (!result.success) { showToast(result.message || "Gagal.", "danger"); setIsSaving(false); return; }
        showToast("Kasir berhasil ditambahkan.");

      } else if (modalMode === "edit" && editTarget) {
        if (!formName.trim()) { showToast("Nama wajib diisi.", "danger"); setIsSaving(false); return; }
        if (!formEmail.trim()) { showToast("Email wajib diisi.", "danger"); setIsSaving(false); return; }
        const result = update(editTarget.id, { name: formName, email: formEmail, role: "kasir" });
        if (!result.success) { showToast(result.message || "Gagal.", "danger"); setIsSaving(false); return; }
        showToast("Data kasir berhasil diubah.");

      } else if (modalMode === "reset" && editTarget) {
        if (!formPassword.trim() || formPassword.length < 6) {
          showToast("Password baru minimal 6 karakter.", "danger"); setIsSaving(false); return;
        }
        const result = resetPassword(editTarget.id, formPassword);
        if (!result.success) { showToast(result.message || "Gagal.", "danger"); setIsSaving(false); return; }
        showToast("Password berhasil direset.");
      }

      loadData();
      closeModal();
      setIsSaving(false);
    }, 300);
  };

  // ---- Delete ----
  const doDelete = (user: User) => {
    remove(user.id);
    showToast(`Kasir "${user.name}" dihapus.`, "warning");
    loadData();
    setDeleteTarget(null);
  };

  const modalTitle = modalMode === "add"
    ? "Tambah Kasir"
    : modalMode === "edit"
    ? "Edit Kasir"
    : "Reset Password";

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar className="user-toolbar">
          <IonButtons slot="start">
            <IonBackButton
              defaultHref="/owner/dashboard"
              icon={chevronBackOutline}
              text=""
            />
          </IonButtons>
          <IonTitle>Kelola Kasir</IonTitle>
          <IonButtons slot="end">
            <IonButton onClick={openAdd} className="add-btn">
              <IonIcon icon={addOutline} slot="icon-only" />
            </IonButton>
          </IonButtons>
        </IonToolbar>
      </IonHeader>

      <IonContent className="user-content">
        <IonRefresher slot="fixed" onIonRefresh={handleRefresh}>
          <IonRefresherContent />
        </IonRefresher>

        {/* Empty State */}
        {list.length === 0 && (
          <div className="empty-state">
            <IonIcon icon={peopleOutline} />
            <h3>Belum ada kasir</h3>
            <p>Tambahkan akun kasir agar mereka bisa mengakses aplikasi.</p>
            <button className="empty-add-btn" onClick={openAdd}>
              <IonIcon icon={addOutline} />
              Tambah Kasir
            </button>
          </div>
        )}

        {/* List */}
        {list.length > 0 && (
          <div className="user-list">
            {list.map((user) => (
              <div key={user.id} className="user-item">
                <div className="user-avatar">
                  {user.name.charAt(0).toUpperCase()}
                </div>
                <div className="user-info">
                  <div className="user-name">{user.name}</div>
                  <div className="user-email">{user.email}</div>
                  <div className="user-role-badge">Kasir</div>
                </div>
                <div className="user-actions">
                  <button
                    className="action-btn reset"
                    onClick={() => openReset(user)}
                    title="Reset Password"
                  >
                    <IonIcon icon={keyOutline} />
                  </button>
                  <button
                    className="action-btn edit"
                    onClick={() => openEdit(user)}
                  >
                    <IonIcon icon={createOutline} />
                  </button>
                  <button
                    className="action-btn delete"
                    onClick={() => setDeleteTarget(user)}
                  >
                    <IonIcon icon={trashOutline} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Delete Overlay */}
        {deleteTarget && (
          <div className="delete-overlay" onClick={() => setDeleteTarget(null)}>
            <div className="delete-card" onClick={(e) => e.stopPropagation()}>
              <div className="delete-card-icon danger">
                <IonIcon icon={trashOutline} />
              </div>
              <h3 className="delete-card-title">Hapus Kasir</h3>
              <p className="delete-card-message">
                Hapus akun kasir <strong>"{deleteTarget.name}"</strong>?
                Kasir tidak bisa login setelah dihapus.
              </p>
              <div className="delete-card-actions">
                <button className="delete-btn cancel" onClick={() => setDeleteTarget(null)}>
                  Batal
                </button>
                <button className="delete-btn confirm danger" onClick={() => doDelete(deleteTarget)}>
                  Hapus
                </button>
              </div>
            </div>
          </div>
        )}

        <IonToast
          isOpen={toast.show}
          message={toast.message}
          duration={2000}
          color={toast.color as any}
          position="top"
          onDidDismiss={() => setToast({ ...toast, show: false })}
        />
      </IonContent>

      {/* Modal Tambah / Edit / Reset */}
      <IonModal
        isOpen={showModal}
        onDidDismiss={closeModal}
        breakpoints={[0, modalMode === "reset" ? 0.45 : 0.75]}
        initialBreakpoint={modalMode === "reset" ? 0.45 : 0.75}
      >
        <IonContent className="modal-scroll-content">
          <div className="modal-handle" />
          <div className="modal-body">
            <div className="modal-header">
              <h3>{modalTitle}</h3>
              <button className="modal-close" onClick={closeModal}>
                <IonIcon icon={closeOutline} />
              </button>
            </div>

            {/* Nama - hanya di add & edit */}
            {(modalMode === "add" || modalMode === "edit") && (
              <div className="modal-field">
                <label className="modal-label">Nama Lengkap</label>
                <div className="modal-input-wrap">
                  <IonIcon icon={personOutline} className="input-icon" />
                  <input
                    type="text"
                    value={formName}
                    onChange={(e) => setFormName(e.target.value)}
                    placeholder="Nama kasir"
                    className="modal-input-native"
                    autoFocus={modalMode === "add"}
                  />
                </div>
              </div>
            )}

            {/* Email - hanya di add & edit */}
            {(modalMode === "add" || modalMode === "edit") && (
              <div className="modal-field">
                <label className="modal-label">Email</label>
                <div className="modal-input-wrap">
                  <IonIcon icon={mailOutline} className="input-icon" />
                  <input
                    type="email"
                    value={formEmail}
                    onChange={(e) => setFormEmail(e.target.value)}
                    placeholder="email@kasir.com"
                    className="modal-input-native"
                    autoComplete="off"
                  />
                </div>
              </div>
            )}

            {/* Password - add & reset */}
            {(modalMode === "add" || modalMode === "reset") && (
              <div className="modal-field">
                <label className="modal-label">
                  {modalMode === "reset" ? "Password Baru" : "Password"}
                </label>
                {modalMode === "reset" && (
                  <p className="reset-info">
                    Membuat password baru untuk kasir{" "}
                    <strong>{editTarget?.name}</strong>
                  </p>
                )}
                <div className="modal-input-wrap">
                  <IonIcon icon={lockClosedOutline} className="input-icon" />
                  <input
                    type="password"
                    value={formPassword}
                    onChange={(e) => setFormPassword(e.target.value)}
                    placeholder="Minimal 6 karakter"
                    className="modal-input-native"
                    autoFocus={modalMode === "reset"}
                  />
                </div>
              </div>
            )}

            <button
              className="modal-save-btn"
              onClick={handleSave}
              disabled={isSaving}
            >
              {isSaving ? (
                <IonSpinner name="crescent" />
              ) : (
                <>
                  <IonIcon icon={checkmarkOutline} />
                  {modalMode === "add"
                    ? "Tambah Kasir"
                    : modalMode === "edit"
                    ? "Simpan Perubahan"
                    : "Reset Password"}
                </>
              )}
            </button>
          </div>
        </IonContent>
      </IonModal>
    </IonPage>
  );
};

export default UserPage;