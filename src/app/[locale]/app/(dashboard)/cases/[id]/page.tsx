'use client';

import { useEffect, useState, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import {
  ArrowLeftIcon,
  PencilIcon,
  DocumentArrowUpIcon,
  DocumentTextIcon,
  TrashIcon,
} from '@heroicons/react/24/outline';
import AppHeader from '@/components/app/AppHeader';

interface CaseClient {
  client: { id: string; firstName: string; lastName: string };
}

interface DocumentData {
  id: string;
  title: string;
  fileName: string;
  fileUrl: string;
  fileSize: number | null;
  mimeType: string | null;
  category: string;
  createdAt: string;
}

interface CaseData {
  id: string;
  title: string;
  description: string | null;
  caseNumber: string | null;
  caseType: string;
  status: string;
  priority: string;
  courtName: string | null;
  courtCaseId: string | null;
  judge: string | null;
  opposingParty: string | null;
  opposingLawyer: string | null;
  nextHearing: string | null;
  openedAt: string;
  clients: CaseClient[];
  documents: DocumentData[];
}

const statusLabels: Record<string, string> = {
  OPEN: 'E hapur',
  IN_PROGRESS: 'Në progres',
  HEARING_SCHEDULED: 'Seancë e caktuar',
  AWAITING_DECISION: 'Në pritje vendimi',
  CLOSED_WON: 'Fituar',
  CLOSED_LOST: 'Humbur',
  CLOSED_SETTLED: 'Marrëveshje',
  APPEALED: 'Ankimuar',
};

const caseTypeLabels: Record<string, string> = {
  CIVIL: 'Civile', CRIMINAL: 'Penale', ADMINISTRATIVE: 'Administrative',
  COMMERCIAL: 'Tregtare', FAMILY: 'Familjare', LABOR: 'Punës',
  PROPERTY: 'Pronësie', CONSTITUTIONAL: 'Kushtetuese',
};

const priorityLabels: Record<string, string> = {
  LOW: 'Ulët', MEDIUM: 'Mesatare', HIGH: 'Lartë', URGENT: 'Urgjente',
};

const categoryLabels: Record<string, string> = {
  CONTRACT: 'Kontratë', COURT_FILING: 'Dokument gjyqësor', EVIDENCE: 'Provë',
  CORRESPONDENCE: 'Korrespondencë', POWER_OF_ATTORNEY: 'Prokurë',
  DECISION: 'Vendim', APPEAL: 'Ankim', OTHER: 'Tjetër',
};

function formatFileSize(bytes: number | null): string {
  if (!bytes) return '';
  if (bytes < 1024) return bytes + ' B';
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
  return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
}

export default function CaseDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const [caseData, setCaseData] = useState<CaseData | null>(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Edit form
  const [form, setForm] = useState({
    title: '', description: '', status: '', priority: '',
    courtName: '', courtCaseId: '', judge: '', opposingParty: '', opposingLawyer: '',
    nextHearing: '',
  });

  // Upload
  const [uploading, setUploading] = useState(false);
  const [uploadTitle, setUploadTitle] = useState('');
  const [uploadCategory, setUploadCategory] = useState('OTHER');
  const [uploadFile, setUploadFile] = useState<File | null>(null);

  const fetchCase = useCallback(async () => {
    try {
      const res = await fetch(`/api/cases/${id}`);
      if (res.ok) {
        const data = await res.json();
        setCaseData(data);
        setForm({
          title: data.title || '',
          description: data.description || '',
          status: data.status || 'OPEN',
          priority: data.priority || 'MEDIUM',
          courtName: data.courtName || '',
          courtCaseId: data.courtCaseId || '',
          judge: data.judge || '',
          opposingParty: data.opposingParty || '',
          opposingLawyer: data.opposingLawyer || '',
          nextHearing: data.nextHearing ? data.nextHearing.slice(0, 16) : '',
        });
      } else {
        setMessage({ type: 'error', text: 'Çështja nuk u gjet' });
      }
    } catch {
      setMessage({ type: 'error', text: 'Gabim gjatë ngarkimit' });
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchCase();
  }, [fetchCase]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage(null);
    try {
      const res = await fetch(`/api/cases/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          nextHearing: form.nextHearing || null,
        }),
      });
      if (res.ok) {
        setMessage({ type: 'success', text: 'Çështja u përditësua!' });
        setEditing(false);
        fetchCase();
      } else {
        const err = await res.json();
        setMessage({ type: 'error', text: err.error || 'Gabim gjatë ruajtjes' });
      }
    } catch {
      setMessage({ type: 'error', text: 'Gabim gjatë lidhjes' });
    } finally {
      setSaving(false);
    }
  };

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!uploadFile) return;
    setUploading(true);
    setMessage(null);

    const formData = new FormData();
    formData.append('file', uploadFile);
    formData.append('title', uploadTitle || uploadFile.name);
    formData.append('category', uploadCategory);
    formData.append('caseId', id);

    try {
      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });
      if (res.ok) {
        setMessage({ type: 'success', text: 'Dokumenti u ngarkua!' });
        setUploadFile(null);
        setUploadTitle('');
        setUploadCategory('OTHER');
        fetchCase();
      } else {
        const err = await res.json();
        setMessage({ type: 'error', text: err.error || 'Gabim gjatë ngarkimit' });
      }
    } catch {
      setMessage({ type: 'error', text: 'Gabim gjatë lidhjes' });
    } finally {
      setUploading(false);
    }
  };

  if (loading) {
    return (
      <div>
        <AppHeader title="Çështja" subtitle="Duke ngarkuar..." />
        <div className="p-6 text-center text-sm text-gray-500">Duke ngarkuar...</div>
      </div>
    );
  }

  if (!caseData) {
    return (
      <div>
        <AppHeader title="Çështja" subtitle="Nuk u gjet" />
        <div className="p-6 text-center">
          <p className="text-gray-500">Çështja nuk u gjet ose nuk keni akses.</p>
          <button onClick={() => router.back()} className="mt-4 text-sm text-blue-600 hover:text-blue-700">
            ← Kthehu mbrapa
          </button>
        </div>
      </div>
    );
  }

  return (
    <div>
      <AppHeader
        title={caseData.caseNumber || 'Çështja'}
        subtitle={caseData.title}
      />

      <div className="p-6 space-y-6">
        {/* Back + Actions */}
        <div className="flex items-center justify-between">
          <button
            onClick={() => router.push('/app/cases')}
            className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900"
          >
            <ArrowLeftIcon className="h-4 w-4" />
            Kthehu te çështjet
          </button>
          <button
            onClick={() => setEditing(!editing)}
            className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
          >
            <PencilIcon className="h-4 w-4" />
            {editing ? 'Anulo ndryshimin' : 'Ndrysho'}
          </button>
        </div>

        {message && (
          <div className={`rounded-lg px-4 py-3 text-sm ${
            message.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
          }`}>
            {message.text}
          </div>
        )}

        {editing ? (
          /* Edit Form */
          <form onSubmit={handleSave} className="space-y-6">
            <div className="rounded-xl border border-gray-200 bg-white p-6 space-y-4">
              <h3 className="font-semibold text-gray-900">Ndrysho çështjen</h3>

              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">Titulli</label>
                <input type="text" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none" required />
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">Përshkrimi</label>
                <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })}
                  rows={3} className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none" />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">Statusi</label>
                  <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none">
                    {Object.entries(statusLabels).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
                  </select>
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">Prioriteti</label>
                  <select value={form.priority} onChange={(e) => setForm({ ...form, priority: e.target.value })}
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none">
                    {Object.entries(priorityLabels).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">Gjykata</label>
                  <input type="text" value={form.courtName} onChange={(e) => setForm({ ...form, courtName: e.target.value })}
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none" />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">Nr. çështjes në gjykatë</label>
                  <input type="text" value={form.courtCaseId} onChange={(e) => setForm({ ...form, courtCaseId: e.target.value })}
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none" />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">Gjyqtari</label>
                  <input type="text" value={form.judge} onChange={(e) => setForm({ ...form, judge: e.target.value })}
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none" />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">Pala kundërshtare</label>
                  <input type="text" value={form.opposingParty} onChange={(e) => setForm({ ...form, opposingParty: e.target.value })}
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none" />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">Avokati kundërshtar</label>
                  <input type="text" value={form.opposingLawyer} onChange={(e) => setForm({ ...form, opposingLawyer: e.target.value })}
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none" />
                </div>
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">Seanca e ardhshme</label>
                <input type="datetime-local" value={form.nextHearing} onChange={(e) => setForm({ ...form, nextHearing: e.target.value })}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none sm:max-w-xs" />
              </div>

              <button type="submit" disabled={saving}
                className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-50">
                {saving ? 'Duke ruajtur...' : 'Ruaj ndryshimet'}
              </button>
            </div>
          </form>
        ) : (
          /* View Mode */
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            {/* Main Info */}
            <div className="lg:col-span-2 space-y-6">
              <div className="rounded-xl border border-gray-200 bg-white p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">{caseData.title}</h3>
                {caseData.description && (
                  <p className="text-sm text-gray-600 mb-4">{caseData.description}</p>
                )}
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div><span className="text-gray-500">Statusi:</span> <span className="font-medium">{statusLabels[caseData.status] || caseData.status}</span></div>
                  <div><span className="text-gray-500">Lloji:</span> <span className="font-medium">{caseTypeLabels[caseData.caseType] || caseData.caseType}</span></div>
                  <div><span className="text-gray-500">Prioriteti:</span> <span className="font-medium">{priorityLabels[caseData.priority] || caseData.priority}</span></div>
                  <div><span className="text-gray-500">Nr. çështjes:</span> <span className="font-medium">{caseData.caseNumber || '—'}</span></div>
                  {caseData.courtName && <div><span className="text-gray-500">Gjykata:</span> <span className="font-medium">{caseData.courtName}</span></div>}
                  {caseData.judge && <div><span className="text-gray-500">Gjyqtari:</span> <span className="font-medium">{caseData.judge}</span></div>}
                  {caseData.opposingParty && <div><span className="text-gray-500">Pala kundërshtare:</span> <span className="font-medium">{caseData.opposingParty}</span></div>}
                  {caseData.opposingLawyer && <div><span className="text-gray-500">Avokati kundërshtar:</span> <span className="font-medium">{caseData.opposingLawyer}</span></div>}
                  {caseData.nextHearing && <div><span className="text-gray-500">Seanca:</span> <span className="font-medium">{new Date(caseData.nextHearing).toLocaleString('sq-AL')}</span></div>}
                </div>

                {caseData.clients.length > 0 && (
                  <div className="mt-4 pt-4 border-t border-gray-100">
                    <span className="text-sm text-gray-500">Klientët:</span>
                    <div className="mt-1 flex flex-wrap gap-2">
                      {caseData.clients.map((cc) => (
                        <span key={cc.client.id} className="rounded-full bg-blue-100 px-3 py-1 text-xs font-medium text-blue-700">
                          {cc.client.firstName} {cc.client.lastName}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Documents */}
              <div className="rounded-xl border border-gray-200 bg-white p-6">
                <h3 className="font-semibold text-gray-900 mb-4">Dokumentet</h3>

                {caseData.documents.length === 0 ? (
                  <p className="text-sm text-gray-500 mb-4">Nuk ka dokumente ende për këtë çështje.</p>
                ) : (
                  <div className="space-y-2 mb-4">
                    {caseData.documents.map((doc) => (
                      <div key={doc.id} className="flex items-center justify-between rounded-lg border border-gray-100 p-3 hover:bg-gray-50">
                        <div className="flex items-center gap-3">
                          <DocumentTextIcon className="h-5 w-5 text-gray-400" />
                          <div>
                            <a href={doc.fileUrl} target="_blank" rel="noopener noreferrer" className="text-sm font-medium text-blue-600 hover:text-blue-700">
                              {doc.title}
                            </a>
                            <p className="text-xs text-gray-500">
                              {doc.fileName} · {formatFileSize(doc.fileSize)} · {categoryLabels[doc.category] || doc.category}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Upload Form */}
                <form onSubmit={handleUpload} className="rounded-lg border border-dashed border-gray-300 p-4 space-y-3">
                  <div className="flex items-center gap-2 text-sm font-medium text-gray-700">
                    <DocumentArrowUpIcon className="h-5 w-5" />
                    Ngarko dokument
                  </div>

                  <div>
                    <input
                      type="file"
                      onChange={(e) => setUploadFile(e.target.files?.[0] || null)}
                      className="w-full text-sm text-gray-500 file:mr-4 file:rounded-lg file:border-0 file:bg-blue-50 file:px-4 file:py-2 file:text-sm file:font-medium file:text-blue-700 hover:file:bg-blue-100"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <input
                      type="text"
                      value={uploadTitle}
                      onChange={(e) => setUploadTitle(e.target.value)}
                      placeholder="Titulli i dokumentit"
                      className="rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
                    />
                    <select
                      value={uploadCategory}
                      onChange={(e) => setUploadCategory(e.target.value)}
                      className="rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
                    >
                      {Object.entries(categoryLabels).map(([k, v]) => (
                        <option key={k} value={k}>{v}</option>
                      ))}
                    </select>
                  </div>

                  <button type="submit" disabled={uploading || !uploadFile}
                    className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50">
                    {uploading ? 'Duke ngarkuar...' : 'Ngarko'}
                  </button>
                </form>
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-4">
              <div className="rounded-xl border border-gray-200 bg-white p-4">
                <p className="text-xs text-gray-500">Hapur më</p>
                <p className="text-sm font-medium">{new Date(caseData.openedAt).toLocaleDateString('sq-AL')}</p>
              </div>
              <div className="rounded-xl border border-gray-200 bg-white p-4">
                <p className="text-xs text-gray-500">Dokumente</p>
                <p className="text-sm font-medium">{caseData.documents.length}</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
