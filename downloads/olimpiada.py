import sys
import os
from PyQt6.QtWidgets import (
    QApplication, QWidget, QVBoxLayout, QHBoxLayout, 
    QListWidget, QPushButton, QFileDialog, QMessageBox, QLabel
)
from PyQt6.QtCore import Qt
from pypdf import PdfReader, PdfWriter


class PDFMergerApp(QWidget):
    def __init__(self):
        super().__init__()
        self.initUI()

    def initUI(self):
        self.setWindowTitle('PDF Merger')
        self.resize(500, 450)
        self.setAcceptDrops(True)  # Enable Drag-and-Drop support for the window

        layout = QVBoxLayout()

        # User instruction label
        self.label = QLabel('Drag and Drop PDF files here or click "Add Files"')
        self.label.setAlignment(Qt.AlignmentFlag.AlignCenter)
        self.label.setStyleSheet("font-size: 14px; margin-bottom: 5px;")
        layout.addWidget(self.label)

        # File list with internal item reordering support
        self.file_list = QListWidget()
        self.file_list.setDragDropMode(QListWidget.DragDropMode.InternalMove)
        layout.addWidget(self.file_list)

        # Button panel for list management
        btn_list_layout = QHBoxLayout()
        
        self.add_btn = QPushButton('Add Files')
        self.add_btn.clicked.connect(self.add_files)
        btn_list_layout.addWidget(self.add_btn)

        self.remove_btn = QPushButton('Remove Selected')
        self.remove_btn.clicked.connect(self.remove_selected)
        btn_list_layout.addWidget(self.remove_btn)

        self.clear_btn = QPushButton('Clear All')
        self.clear_btn.clicked.connect(self.clear_list)
        btn_list_layout.addWidget(self.clear_btn)

        layout.addLayout(btn_list_layout)

        # Main merge button
        self.merge_btn = QPushButton('Merge')
        self.merge_btn.setStyleSheet("font-size: 16px; font-weight: bold; padding: 10px;")
        self.merge_btn.clicked.connect(self.merge_pdfs)
        layout.addWidget(self.merge_btn)

        self.setLayout(layout)

    # --- Drag & Drop event handlers ---
    def dragEnterEvent(self, event):
        if event.mimeData().hasUrls():
            event.acceptProposedAction()

    def dropEvent(self, event):
        for url in event.mimeData().urls():
            file_path = url.toLocalFile()
            if file_path.lower().endswith('.pdf'):
                self.file_list.addItem(file_path)

    # --- List management functions ---
    def add_files(self):
        files, _ = QFileDialog.getOpenFileNames(
            self, "Select PDF Files", "", "PDF Files (*.pdf)"
        )
        if files:
            self.file_list.addItems(files)

    def remove_selected(self):
        current_item = self.file_list.currentItem()
        if current_item:
            self.file_list.takeItem(self.file_list.row(current_item))

    def clear_list(self):
        self.file_list.clear()

    # --- Merge logic using Writer ---
    def merge_pdfs(self):
        count = self.file_list.count()
        if count < 2:
            QMessageBox.warning(
                self, "Warning", "Please add at least 2 PDF files to merge!"
            )
            return

        save_path, _ = QFileDialog.getSaveFileName(
            self, "Save Merged PDF", "merged_document.pdf", "PDF Files (*.pdf)"
        )

        if not save_path:
            return

        try:
            writer = PdfWriter()

            # Iterate through all files in the list and append pages to writer
            for i in range(count):
                file_path = self.file_list.item(i).text()
                reader = PdfReader(file_path)
                for page in reader.pages:
                    writer.add_page(page)

            # Save the result
            with open(save_path, 'wb') as output_file:
                writer.write(output_file)

            QMessageBox.information(
                self, "Success", f"Files successfully merged!\nSaved to:\n{save_path}"
            )
        except Exception as e:
            QMessageBox.critical(
                self, "Error", f"An error occurred while merging:\n{str(e)}"
            )


if __name__ == '__main__':
    app = QApplication(sys.argv)
    window = PDFMergerApp()
    window.show()
    sys.exit(app.exec())