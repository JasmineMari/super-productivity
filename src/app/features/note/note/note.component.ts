import {ChangeDetectionStrategy, Component, Input, ViewChild} from '@angular/core';
import {Note} from '../note.model';
import {NoteService} from '../note.service';
import {MatDialog} from '@angular/material/dialog';
import {DialogAddNoteReminderComponent} from '../dialog-add-note-reminder/dialog-add-note-reminder.component';
import {T} from '../../../t.const';
import {DialogFullscreenMarkdownComponent} from '../../../ui/dialog-fullscreen-markdown/dialog-fullscreen-markdown.component';

@Component({
  selector: 'note',
  templateUrl: './note.component.html',
  styleUrls: ['./note.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class NoteComponent {
  @Input() note: Note;
  @Input() isFocus: boolean;

  @ViewChild('markdownEl') markdownEl: HTMLElement;

  T = T;

  constructor(
    private readonly _matDialog: MatDialog,
    private readonly _noteService: NoteService,
  ) {
  }

  toggleLock() {
    this._noteService.update(this.note.id, {isLock: !this.note.isLock});
  }

  updateContent(newVal) {
    this._noteService.update(this.note.id, {content: newVal});
  }

  removeNote() {
    this._noteService.remove(this.note.id);
  }

  editReminder() {
    this._matDialog.open(DialogAddNoteReminderComponent, {
      restoreFocus: true,
      data: {
        note: this.note,
      }
    });
  }

  removeReminder() {
    this._noteService.removeReminder(this.note.id, this.note.reminderId);
  }

  editFullscreen() {
    this._matDialog.open(DialogFullscreenMarkdownComponent, {
      minWidth: '100vw',
      height: '100vh',
      restoreFocus: true,
      data: {
        content: this.note.content,
      }
    }).afterClosed().subscribe((content) => {
      if (typeof content === 'string') {
        this._noteService.update(this.note.id, {content});
      }
    });
  }
}
