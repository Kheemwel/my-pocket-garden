// Settings panel component
import { Component, createSignal, Show } from 'solid-js';
import { saveManager } from '../../persistence/SaveManager';

export const SettingsPanel: Component = () => {
  const [showResetConfirm, setShowResetConfirm] = createSignal(false);
  const [importStatus, setImportStatus] = createSignal<string | null>(null);
  
  let fileInput: HTMLInputElement | undefined;
  
  const handleExport = () => {
    saveManager.exportSave();
    setImportStatus('Save exported!');
    setTimeout(() => setImportStatus(null), 3000);
  };
  
  const handleImportClick = () => {
    fileInput?.click();
  };
  
  const handleImport = async (e: Event) => {
    const input = e.target as HTMLInputElement;
    const file = input.files?.[0];
    if (!file) return;
    
    const result = await saveManager.importSave(file);
    if (result.success) {
      setImportStatus('Save imported successfully!');
    } else {
      setImportStatus(`Import failed: ${result.error}`);
    }
    
    // Clear the input
    input.value = '';
    
    setTimeout(() => setImportStatus(null), 3000);
  };
  
  const handleSave = () => {
    saveManager.save();
    setImportStatus('Game saved!');
    setTimeout(() => setImportStatus(null), 3000);
  };
  
  const handleReset = () => {
    saveManager.reset();
    setShowResetConfirm(false);
    setImportStatus('Game reset!');
    setTimeout(() => setImportStatus(null), 3000);
  };
  
  return (
    <div class="settings-panel">
      <h3>Settings</h3>
      
      <div class="settings-section">
        <h4>Save Management</h4>
        <div class="settings-buttons">
          <button class="settings-btn" onClick={handleSave}>
            💾 Save Game
          </button>
          <button class="settings-btn" onClick={handleExport}>
            📤 Export Save
          </button>
          <button class="settings-btn" onClick={handleImportClick}>
            📥 Import Save
          </button>
          <input
            ref={fileInput}
            type="file"
            accept=".json"
            class="import-input"
            onChange={handleImport}
          />
        </div>
      </div>
      
      <Show when={importStatus()}>
        <div class="status-message">
          {importStatus()}
        </div>
      </Show>
      
      <div class="settings-section">
        <h4>Danger Zone</h4>
        <Show
          when={showResetConfirm()}
          fallback={
            <button 
              class="settings-btn danger" 
              onClick={() => setShowResetConfirm(true)}
            >
              🗑️ Reset Game
            </button>
          }
        >
          <div class="reset-confirm">
            <p>Are you sure? This will delete all your progress!</p>
            <div class="settings-buttons">
              <button class="settings-btn danger" onClick={handleReset}>
                Yes, Reset Everything
              </button>
              <button class="settings-btn" onClick={() => setShowResetConfirm(false)}>
                Cancel
              </button>
            </div>
          </div>
        </Show>
      </div>
      
      <div class="settings-section">
        <h4>About</h4>
        <p>My Pocket Garden v1.0</p>
        <p style={{ color: 'var(--text-secondary)', 'font-size': 'var(--font-size-sm)' }}>
          A cozy garden game where you plant, harvest, cook, and craft!
        </p>
        <p style={{ color: 'var(--text-muted)', 'font-size': 'var(--font-size-xs)' }}>
          Game auto-saves every 30 seconds and when you make important actions.
        </p>
      </div>
    </div>
  );
};
