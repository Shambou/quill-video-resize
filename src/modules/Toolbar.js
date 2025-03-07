import { BaseModule } from './BaseModule'

const Parchment = window.Quill.imports.parchment
const FloatStyle = new Parchment.Attributor.Style('float', 'float')
const MarginStyle = new Parchment.Attributor.Style('margin', 'margin')
const DisplayStyle = new Parchment.Attributor.Style('display', 'display')

export class Toolbar extends BaseModule {
	onCreate() {
		// Setup Toolbar
		this.toolbar = document.createElement('div')
		Object.assign(this.toolbar.style, this.options.toolbarStyles)
		this.overlay.appendChild(this.toolbar)

		// Setup Buttons
		this._defineAlignments()
		this._addToolbarButtons()
	}

	// The toolbar and its children will be destroyed when the overlay is removed
	onDestroy() { }

	// Nothing to update on drag because we are are positioned relative to the overlay
	onUpdate() { }

	_defineAlignments() {
		this.alignments = [
			{
				icon: '<span class="material-icons">format_align_left</span>',
				apply: () => {
					DisplayStyle.add(this.vid, 'inline')
					FloatStyle.add(this.vid, 'left')
					MarginStyle.add(this.vid, '0 1em 1em 0')
				},
				isApplied: () => FloatStyle.value(this.vid) == 'left'
			},
			{
				icon: '<span class="material-icons">format_align_center</span>',
				apply: () => {
					DisplayStyle.add(this.vid, 'block')
					FloatStyle.remove(this.vid)
					MarginStyle.add(this.vid, 'auto')
				},
				isApplied: () => MarginStyle.value(this.vid) == 'auto'
			},
			{
				icon: '<span class="material-icons">format_align_right</span>',
				apply: () => {
					DisplayStyle.add(this.vid, 'inline')
					FloatStyle.add(this.vid, 'right')
					MarginStyle.add(this.vid, '0 0 1em 1em')
				},
				isApplied: () => FloatStyle.value(this.vid) == 'right'
			},
		]
	}

	_addToolbarButtons() {
		const buttons = []
		this.alignments.forEach((alignment, idx) => {
			const button = document.createElement('span')
			buttons.push(button)
			button.innerHTML = alignment.icon
			button.addEventListener('click', () => {
				// deselect all buttons
				buttons.forEach(button => button.style.filter = '')
				if (alignment.isApplied()) {
					// If applied, unapply
					FloatStyle.remove(this.vid)
					MarginStyle.remove(this.vid)
					DisplayStyle.remove(this.vid)
				} else {
					// otherwise, select button and apply
					this._selectButton(button)
					alignment.apply()
				}
				// image may change position redraw drag handles
				this.requestUpdate()
			})
			Object.assign(button.style, this.options.toolbarButtonStyles)
			if (idx > 0) {
				button.style.borderLeftWidth = '0'
			}

			if (alignment.isApplied()) {
				// select button if previously applied
				this._selectButton(button)
			}
			this.toolbar.appendChild(button)
		})
	}

	_selectButton(button) {
		return button.style.filter = 'invert(20%)'
	}

}
