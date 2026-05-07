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
  fastFoodOutline,
  chevronBackOutline,
  closeOutline,
  checkmarkOutline,
  chevronDownOutline,
} from "ionicons/icons";
import { MenuWithKategori, Kategori } from "../../types";
import {
  getAllWithKategori,
  create,
  update,
  remove,
  isUsedInTransaksi,
} from "../../services/menu.service";
import { getAll as getAllKategori } from "../../services/kategori.service";
import "./MenuPage.css";
import CustomToast from "../../components/CustomToast";

const formatRupiah = (amount: number) =>
  new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(amount);

type DeleteStep = "idle" | "confirm";

const MenuPage: React.FC = () => {
  const [list, setList] = useState<MenuWithKategori[]>([]);
  const [kategoriList, setKategoriList] = useState<Kategori[]>([]);
  const [filterKategori, setFilterKategori] = useState<string>("all");

  const [showModal, setShowModal] = useState(false);
  const [editTarget, setEditTarget] = useState<MenuWithKategori | null>(null);
  const [formNama, setFormNama] = useState("");
  const [formHarga, setFormHarga] = useState("");
  const [formKategoriId, setFormKategoriId] = useState("");
  const [showKategoriDropdown, setShowKategoriDropdown] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const [deleteTarget, setDeleteTarget] = useState<MenuWithKategori | null>(
    null
  );
  const [deleteStep, setDeleteStep] = useState<DeleteStep>("idle");

  const [toast, setToast] = useState({
    show: false,
    message: "",
    color: "success",
  });
  const showToast = (message: string, color = "success") =>
    setToast({ show: true, message, color });

  const loadData = () => {
    setList(getAllWithKategori());
    setKategoriList(getAllKategori());
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleRefresh = (event: CustomEvent<RefresherEventDetail>) => {
    loadData();
    event.detail.complete();
  };

  const filteredList =
    filterKategori === "all"
      ? list
      : list.filter((m) => m.kategori_id === filterKategori);

  const openAdd = () => {
    setEditTarget(null);
    setFormNama("");
    setFormHarga("");
    setFormKategoriId(kategoriList[0]?.id || "");
    setShowKategoriDropdown(false);
    setShowModal(true);
  };

  const openEdit = (item: MenuWithKategori) => {
    setEditTarget(item);
    setFormNama(item.nama_menu);
    setFormHarga(String(item.harga));
    setFormKategoriId(item.kategori_id);
    setShowKategoriDropdown(false);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditTarget(null);
    setFormNama("");
    setFormHarga("");
    setFormKategoriId("");
    setShowKategoriDropdown(false);
  };

  const handleSave = () => {
    if (!formNama.trim()) {
      showToast("Nama menu wajib diisi.", "danger");
      return;
    }
    const harga = Number(formHarga);
    if (!formHarga || isNaN(harga) || harga <= 0) {
      showToast("Harga harus berupa angka lebih dari 0.", "danger");
      return;
    }
    if (!formKategoriId) {
      showToast("Pilih kategori terlebih dahulu.", "danger");
      return;
    }

    setIsSaving(true);
    setTimeout(() => {
      if (editTarget) {
        update(editTarget.id, {
          nama_menu: formNama,
          harga,
          kategori_id: formKategoriId,
        });
        showToast("Menu berhasil diubah.");
      } else {
        create({ nama_menu: formNama, harga, kategori_id: formKategoriId });
        showToast("Menu berhasil ditambahkan.");
      }
      loadData();
      closeModal();
      setIsSaving(false);
    }, 300);
  };

  const handleDeletePress = (item: MenuWithKategori) => {
    if (isUsedInTransaksi(item.id)) {
      showToast(
        "Menu ini tidak bisa dihapus karena sudah ada di transaksi.",
        "warning"
      );
      return;
    }
    setDeleteTarget(item);
    setDeleteStep("confirm");
  };

  const doDelete = () => {
    if (!deleteTarget) return;
    remove(deleteTarget.id);
    showToast(`Menu "${deleteTarget.nama_menu}" dihapus.`, "success");
    loadData();
    resetDelete();
  };

  const resetDelete = () => {
    setDeleteTarget(null);
    setDeleteStep("idle");
  };

  const selectedKategoriLabel = formKategoriId
    ? kategoriList.find((k) => k.id === formKategoriId)?.nama_kategori
    : null;

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar className="menu-toolbar">
          <IonButtons slot="start">
            <IonBackButton
              defaultHref="/owner/dashboard"
              icon={chevronBackOutline}
              text=""
            />
          </IonButtons>
          <IonTitle>Kelola Menu</IonTitle>
          <IonButtons slot="end">
            <IonButton onClick={openAdd} className="add-btn">
              <IonIcon icon={addOutline} slot="icon-only" />
            </IonButton>
          </IonButtons>
        </IonToolbar>

        {kategoriList.length > 0 && (
          <div className="filter-bar">
            <button
              className={`filter-chip ${
                filterKategori === "all" ? "active" : ""
              }`}
              onClick={() => setFilterKategori("all")}
            >
              Semua
            </button>
            {kategoriList.map((k) => (
              <button
                key={k.id}
                className={`filter-chip ${
                  filterKategori === k.id ? "active" : ""
                }`}
                onClick={() => setFilterKategori(k.id)}
              >
                {k.nama_kategori}
              </button>
            ))}
          </div>
        )}
      </IonHeader>

      <IonContent className="menu-content">
        <IonRefresher slot="fixed" onIonRefresh={handleRefresh}>
          <IonRefresherContent />
        </IonRefresher>

        {kategoriList.length === 0 && (
          <div className="empty-state">
            <IonIcon icon={fastFoodOutline} />
            <h3>Belum ada kategori</h3>
            <p>Tambahkan kategori terlebih dahulu sebelum menambah menu.</p>
          </div>
        )}

        {kategoriList.length > 0 && filteredList.length === 0 && (
          <div className="empty-state">
            <IonIcon icon={fastFoodOutline} />
            <h3>Belum ada menu</h3>
            <p>Tekan tombol + untuk menambahkan menu baru.</p>
            <button className="empty-add-btn" onClick={openAdd}>
              <IonIcon icon={addOutline} />
              Tambah Menu
            </button>
          </div>
        )}

        {filteredList.length > 0 && (
          <div className="menu-list">
            {filteredList.map((item) => (
              <div key={item.id} className="menu-item">
                <div className="menu-icon-wrap">
                  <IonIcon icon={fastFoodOutline} />
                </div>
                <div className="menu-info">
                  <div className="menu-name">{item.nama_menu}</div>
                  <div className="menu-kategori">{item.nama_kategori}</div>
                  <div className="menu-harga">{formatRupiah(item.harga)}</div>
                </div>
                <div className="menu-actions">
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
            ))}
          </div>
        )}

        {deleteStep === "confirm" && (
          <div className="delete-overlay" onClick={resetDelete}>
            <div className="delete-card" onClick={(e) => e.stopPropagation()}>
              <div className="delete-card-icon danger">
                <IonIcon icon={trashOutline} />
              </div>
              <h3 className="delete-card-title">Hapus Menu</h3>
              <p className="delete-card-message">
                Hapus menu <strong>"{deleteTarget?.nama_menu}"</strong>?
                Tindakan ini tidak bisa dibatalkan.
              </p>
              <div className="delete-card-actions">
                <button className="delete-btn cancel" onClick={resetDelete}>
                  Batal
                </button>
                <button
                  className="delete-btn confirm danger"
                  onClick={doDelete}
                >
                  Hapus
                </button>
              </div>
            </div>
          </div>
        )}
      </IonContent>

      {/* ---- MODAL TAMBAH / EDIT ---- */}
      <IonModal
        isOpen={showModal}
        onDidDismiss={closeModal}
        breakpoints={[0, 0.75]}
        initialBreakpoint={0.75}
      >
        <IonContent className="modal-scroll-content">
          <div className="modal-handle" />
          <div className="modal-body">
            <div className="modal-header">
              <h3>{editTarget ? "Edit Menu" : "Tambah Menu"}</h3>
              <button className="modal-close" onClick={closeModal}>
                <IonIcon icon={closeOutline} />
              </button>
            </div>

            {/* Nama Menu */}
            <div className="modal-field">
              <label className="modal-label">Nama Menu</label>
              <div className="modal-input-wrap">
                <input
                  type="text"
                  value={formNama}
                  onChange={(e) => setFormNama(e.target.value)}
                  placeholder="contoh: Es Teh Manis, Nasi Goreng..."
                  className="modal-input-native"
                  autoFocus
                />
              </div>
            </div>

            {/* Harga */}
            <div className="modal-field">
              <label className="modal-label">Harga (Rp)</label>
              <div className="modal-input-wrap">
                <input
                  type="number"
                  value={formHarga}
                  onChange={(e) => setFormHarga(e.target.value)}
                  placeholder="contoh: 5000"
                  className="modal-input-native"
                  min="0"
                  inputMode="numeric"
                />
              </div>
            </div>

            {/* Kategori — Custom Dropdown */}
            <div className="modal-field dropdown-field">
              <label className="modal-label">Kategori</label>
              <div
                className={`modal-select-wrap ${
                  showKategoriDropdown ? "open" : ""
                }`}
                onClick={() => setShowKategoriDropdown((v) => !v)}
              >
                <span
                  className={`modal-select-value ${
                    !selectedKategoriLabel ? "placeholder" : ""
                  }`}
                >
                  {selectedKategoriLabel ?? "-- Pilih Kategori --"}
                </span>
                <IonIcon
                  icon={chevronDownOutline}
                  className={`select-icon ${
                    showKategoriDropdown ? "rotated" : ""
                  }`}
                />
              </div>

              {showKategoriDropdown && (
                <div className="custom-dropdown">
                  <div
                    className="custom-dropdown-item is-placeholder"
                    onClick={(e) => {
                      e.stopPropagation();
                      setFormKategoriId("");
                      setShowKategoriDropdown(false);
                    }}
                  >
                    -- Pilih Kategori --
                  </div>
                  {kategoriList.map((k) => (
                    <div
                      key={k.id}
                      className={`custom-dropdown-item ${
                        formKategoriId === k.id ? "is-selected" : ""
                      }`}
                      onClick={(e) => {
                        e.stopPropagation();
                        setFormKategoriId(k.id);
                        setShowKategoriDropdown(false);
                      }}
                    >
                      {k.nama_kategori}
                    </div>
                  ))}
                </div>
              )}
            </div>

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
                  {editTarget ? "Simpan Perubahan" : "Tambah Menu"}
                </>
              )}
            </button>
          </div>
        </IonContent>
      </IonModal>
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

export default MenuPage;
