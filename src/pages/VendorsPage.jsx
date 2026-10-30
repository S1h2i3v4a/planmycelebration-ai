import React, { useState } from 'react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { Modal } from '../components/ui/Modal';
import { InputField, SelectField, TextareaField } from '../components/ui/Input';
import { Icon } from '../components/Icon';
import { formatCurrency } from '../utils/calculations';

const VENDOR_CATEGORIES = [
  'Venue & Rentals',
  'Food & Catering',
  'Decoration & Floral',
  'Photography & Video',
  'Music & Entertainment',
  'Transport & Hospitality',
  'Other'
];

const VENDOR_QUESTIONS = [
  'Is the date locked, and what is your cancellation / rescheduling policy?',
  'Are taxes, service charges, generator backup, and permit fees included in the quote?',
  'What is the overtime policy if the celebration runs past the scheduled end time?',
  'Can we review signed contracts from recent clients or inspect sample portfolios?',
  'Who will be the dedicated on-site coordinator during our event date?'
];

export function VendorsPage({
  activeEvent,
  onUpdateEvent,
  onOpenCreateEventModal,
  onLoadSampleEvent
}) {
  const [vendorModalOpen, setVendorModalOpen] = useState(false);
  const [editingVendor, setEditingVendor] = useState(null);
  const [vendorForm, setVendorForm] = useState({
    name: '',
    category: 'Venue & Rentals',
    quotedPrice: '',
    contactPerson: '',
    phone: '',
    notes: ''
  });
  const [formError, setFormError] = useState('');

  if (!activeEvent) {
    return (
      <section aria-labelledby="vendors-empty-heading">
        <Card style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
          <div>
            <Badge variant="plum">Vendor Shortlist</Badge>
            <h2 id="vendors-empty-heading" style={{ marginTop: 'var(--space-2)' }}>
              Select or create an event to manage your vendor shortlist
            </h2>
            <p style={{ fontSize: 'var(--text-sm)', marginTop: 'var(--space-1)' }}>
              Maintain shortlisted venues, caterers, decorators, and photographers with quoted
              prices and comparison notes.
            </p>
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--space-3)' }}>
            <Button variant="primary" onClick={() => onOpenCreateEventModal()}>
              <Icon name="plus" size={16} />
              <span>Create Event</span>
            </Button>
            <Button variant="secondary" onClick={onLoadSampleEvent}>
              <Icon name="sparkles" size={16} />
              <span>Load Sample Event</span>
            </Button>
          </div>
        </Card>
      </section>
    );
  }

  const currency = activeEvent.currency || 'INR';
  const vendors = Array.isArray(activeEvent.vendors) ? activeEvent.vendors : [];

  const handleOpenAddModal = () => {
    setEditingVendor(null);
    setFormError('');
    setVendorForm({
      name: '',
      category: 'Venue & Rentals',
      quotedPrice: '',
      contactPerson: '',
      phone: '',
      notes: ''
    });
    setVendorModalOpen(true);
  };

  const handleOpenEditModal = (v) => {
    setEditingVendor(v);
    setFormError('');
    setVendorForm({
      name: v.name || '',
      category: VENDOR_CATEGORIES.includes(v.category) ? v.category : 'Venue & Rentals',
      quotedPrice: v.quotedPrice ? String(v.quotedPrice) : '',
      contactPerson: v.contactPerson || '',
      phone: v.phone || '',
      notes: v.notes || ''
    });
    setVendorModalOpen(true);
  };

  const handleSaveVendor = (e) => {
    e.preventDefault();
    const nameTrim = vendorForm.name.trim();
    if (!nameTrim || nameTrim.length < 2) {
      setFormError('Please enter a valid vendor name.');
      return;
    }

    const priceNum = vendorForm.quotedPrice !== '' ? Number(vendorForm.quotedPrice) : 0;
    if (!Number.isFinite(priceNum) || priceNum < 0) {
      setFormError('Quoted price must be a valid positive number.');
      return;
    }

    const payload = {
      id: editingVendor ? editingVendor.id : `vendor_${Date.now()}`,
      name: nameTrim,
      category: vendorForm.category,
      quotedPrice: Math.round(priceNum),
      contactPerson: vendorForm.contactPerson.trim(),
      phone: vendorForm.phone.trim(),
      notes: vendorForm.notes.trim()
    };

    const updatedVendors = editingVendor
      ? vendors.map((v) => (v.id === editingVendor.id ? payload : v))
      : [payload, ...vendors];

    onUpdateEvent({
      ...activeEvent,
      vendors: updatedVendors,
      updatedAt: new Date().toISOString()
    });

    setVendorModalOpen(false);
  };

  const handleDeleteVendor = (vendorId) => {
    const updated = vendors.filter((v) => v.id !== vendorId);
    onUpdateEvent({
      ...activeEvent,
      vendors: updated,
      updatedAt: new Date().toISOString()
    });
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
      {/* Header */}
      <div
        style={{
          display: 'flex',
          alignItems: 'flex-end',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: 'var(--space-4)'
        }}
      >
        <div>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 'var(--space-2)',
              marginBottom: '4px'
            }}
          >
            <Badge variant="plum">{activeEvent.type}</Badge>
            <Badge variant="neutral">{vendors.length} Shortlisted Vendors</Badge>
          </div>
          <h2>Vendor Shortlist & Comparison — {activeEvent.name}</h2>
          <p style={{ fontSize: 'var(--text-sm)' }}>
            Track vendor quotes, contact numbers, and comparison notes for your celebration.
          </p>
        </div>

        <Button variant="primary" onClick={handleOpenAddModal}>
          <Icon name="plus" size={16} />
          <span>Add Vendor Shortlist Entry</span>
        </Button>
      </div>

      {/* Vendor Cards Grid */}
      {vendors.length === 0 ? (
        <Card variant="subtle" style={{ textAlign: 'center', padding: 'var(--space-8)' }}>
          <h3>No vendors shortlisted for this event yet</h3>
          <p
            style={{
              fontSize: 'var(--text-sm)',
              marginTop: '4px',
              marginBottom: 'var(--space-4)'
            }}
          >
            Maintain your own vendor shortlist with quoted prices, contact info, and notes.
          </p>
          <Button variant="primary" onClick={handleOpenAddModal}>
            <Icon name="plus" size={16} />
            <span>Add First Vendor</span>
          </Button>
        </Card>
      ) : (
        <div className="events-cards-grid">
          {vendors.map((v) => (
            <Card
              key={v.id}
              style={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                gap: 'var(--space-4)'
              }}
            >
              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between'
                  }}
                >
                  <Badge variant="coral">{v.category}</Badge>
                  <strong
                    style={{
                      fontSize: 'var(--text-base)',
                      color: 'var(--color-primary)'
                    }}
                  >
                    {formatCurrency(v.quotedPrice, currency)}
                  </strong>
                </div>

                <h3 style={{ fontSize: 'var(--text-lg)', marginTop: '4px' }}>{v.name}</h3>

                <div
                  style={{
                    fontSize: 'var(--text-xs)',
                    color: 'var(--text-secondary)',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '2px'
                  }}
                >
                  {v.contactPerson && (
                    <span>
                      Contact: <strong>{v.contactPerson}</strong>
                    </span>
                  )}
                  {v.phone && (
                    <span>
                      Phone: <strong>{v.phone}</strong>
                    </span>
                  )}
                  {v.notes && (
                    <span style={{ marginTop: '4px', fontStyle: 'italic' }}>
                      "{v.notes}"
                    </span>
                  )}
                </div>
              </div>

              <div
                style={{
                  display: 'flex',
                  justifyContent: 'flex-end',
                  gap: 'var(--space-2)',
                  paddingTop: 'var(--space-3)',
                  borderTop: '1px solid var(--border-subtle)'
                }}
              >
                <Button variant="secondary" onClick={() => handleOpenEditModal(v)}>
                  <Icon name="edit" size={14} />
                  <span>Edit</span>
                </Button>
                <Button
                  variant="ghost"
                  onClick={() => handleDeleteVendor(v.id)}
                  style={{ color: 'var(--status-danger-text)' }}
                  aria-label={`Delete vendor ${v.name}`}
                >
                  <Icon name="trash" size={16} />
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Structured Questions to Ask Vendors */}
      <Card style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
          <Icon name="info" size={18} />
          <h3>Essential Questions to Ask Shortlisted Vendors</h3>
        </div>
        <p style={{ fontSize: 'var(--text-xs)' }}>
          Use these checklist questions when interviewing venues, caterers, and decorators to
          prevent hidden charges.
        </p>

        <ul
          style={{
            paddingLeft: '1.25rem',
            display: 'flex',
            flexDirection: 'column',
            gap: 'var(--space-2)'
          }}
        >
          {VENDOR_QUESTIONS.map((q, idx) => (
            <li
              key={idx}
              style={{ fontSize: 'var(--text-sm)', color: 'var(--text-secondary)' }}
            >
              {q}
            </li>
          ))}
        </ul>
      </Card>

      {/* Add / Edit Vendor Modal */}
      <Modal
        isOpen={vendorModalOpen}
        onClose={() => setVendorModalOpen(false)}
        title={editingVendor ? 'Edit Vendor Shortlist Entry' : 'Add Vendor Shortlist Entry'}
        footer={
          <>
            <Button variant="secondary" onClick={() => setVendorModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" onClick={handleSaveVendor}>
              <Icon name="check" size={15} />
              <span>{editingVendor ? 'Save Changes' : 'Add to Shortlist'}</span>
            </Button>
          </>
        }
      >
        <form onSubmit={handleSaveVendor} className="wizard-form-grid">
          <InputField
            id="v-name"
            label="Vendor / Business Name"
            required
            placeholder="e.g., Royal Orchid Banquets, Sangeet Sound & Lights"
            value={vendorForm.name}
            onChange={(e) => {
              setVendorForm((prev) => ({ ...prev, name: e.target.value }));
              if (formError) setFormError('');
            }}
            error={formError}
          />

          <div className="form-row-2">
            <SelectField
              id="v-category"
              label="Category"
              value={vendorForm.category}
              onChange={(e) =>
                setVendorForm((prev) => ({ ...prev, category: e.target.value }))
              }
              options={VENDOR_CATEGORIES}
            />

            <InputField
              id="v-price"
              label={`Quoted Price (${currency})`}
              type="number"
              min={0}
              step={1000}
              placeholder="e.g., 150000"
              value={vendorForm.quotedPrice}
              onChange={(e) =>
                setVendorForm((prev) => ({
                  ...prev,
                  quotedPrice: e.target.value
                }))
              }
            />
          </div>

          <div className="form-row-2">
            <InputField
              id="v-contact"
              label="Contact Person (Optional)"
              placeholder="e.g., Mr. Rajesh Sharma"
              value={vendorForm.contactPerson}
              onChange={(e) =>
                setVendorForm((prev) => ({
                  ...prev,
                  contactPerson: e.target.value
                }))
              }
            />

            <InputField
              id="v-phone"
              label="Phone Number (Optional)"
              placeholder="e.g., +91 98765 43210"
              value={vendorForm.phone}
              onChange={(e) =>
                setVendorForm((prev) => ({ ...prev, phone: e.target.value }))
              }
            />
          </div>

          <TextareaField
            id="v-notes"
            label="Comparison Notes & Terms (Optional)"
            placeholder="e.g., Includes generator backup, 2 free changing rooms, 50% advance required."
            value={vendorForm.notes}
            onChange={(e) =>
              setVendorForm((prev) => ({ ...prev, notes: e.target.value }))
            }
            rows={3}
          />
        </form>
      </Modal>
    </div>
  );
}

export default VendorsPage;
