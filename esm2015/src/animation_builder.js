/**
 * AnimationBuilder is an injectable service that is available when the {@link
 * BrowserAnimationsModule BrowserAnimationsModule} or {@link NoopAnimationsModule
 * NoopAnimationsModule} modules are used within an application.
 *
 * The purpose if this service is to produce an animation sequence programmatically within an
 * angular component or directive.
 *
 * Programmatic animations are first built and then a player is created when the build animation is
 * attached to an element.
 *
 * ```ts
 * // remember to include the BrowserAnimationsModule module for this to work...
 * import {AnimationBuilder} from '@angular/animations';
 *
 * class MyCmp {
 *   constructor(private _builder: AnimationBuilder) {}
 *
 *   makeAnimation(element: any) {
 *     // first build the animation
 *     const myAnimation = this._builder.build([
 *       style({ width: 0 }),
 *       animate(1000, style({ width: '100px' }))
 *     ]);
 *
 *     // then create a player from it
 *     const player = myAnimation.create(element);
 *
 *     player.play();
 *   }
 * }
 * ```
 *
 * When an animation is built an instance of {@link AnimationFactory AnimationFactory} will be
 * returned. Using that an {@link AnimationPlayer AnimationPlayer} can be created which can then be
 * used to start the animation.
 *
 * @experimental Animation support is experimental.
 */
export class AnimationBuilder {
}
/**
 * An instance of `AnimationFactory` is returned from {@link AnimationBuilder#build
 * AnimationBuilder.build}.
 *
 * @experimental Animation support is experimental.
 */
export class AnimationFactory {
}

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYW5pbWF0aW9uX2J1aWxkZXIuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi9wYWNrYWdlcy9hbmltYXRpb25zL3NyYy9hbmltYXRpb25fYnVpbGRlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFVQTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7R0FzQ0c7QUFDSCxNQUFNO0NBRUw7QUFFRDs7Ozs7R0FLRztBQUNILE1BQU07Q0FFTCIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCBHb29nbGUgSW5jLiBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICpcbiAqIFVzZSBvZiB0aGlzIHNvdXJjZSBjb2RlIGlzIGdvdmVybmVkIGJ5IGFuIE1JVC1zdHlsZSBsaWNlbnNlIHRoYXQgY2FuIGJlXG4gKiBmb3VuZCBpbiB0aGUgTElDRU5TRSBmaWxlIGF0IGh0dHBzOi8vYW5ndWxhci5pby9saWNlbnNlXG4gKi9cbmltcG9ydCB7QW5pbWF0aW9uTWV0YWRhdGEsIEFuaW1hdGlvbk9wdGlvbnN9IGZyb20gJy4vYW5pbWF0aW9uX21ldGFkYXRhJztcbmltcG9ydCB7QW5pbWF0aW9uUGxheWVyfSBmcm9tICcuL3BsYXllcnMvYW5pbWF0aW9uX3BsYXllcic7XG5cbi8qKlxuICogQW5pbWF0aW9uQnVpbGRlciBpcyBhbiBpbmplY3RhYmxlIHNlcnZpY2UgdGhhdCBpcyBhdmFpbGFibGUgd2hlbiB0aGUge0BsaW5rXG4gKiBCcm93c2VyQW5pbWF0aW9uc01vZHVsZSBCcm93c2VyQW5pbWF0aW9uc01vZHVsZX0gb3Ige0BsaW5rIE5vb3BBbmltYXRpb25zTW9kdWxlXG4gKiBOb29wQW5pbWF0aW9uc01vZHVsZX0gbW9kdWxlcyBhcmUgdXNlZCB3aXRoaW4gYW4gYXBwbGljYXRpb24uXG4gKlxuICogVGhlIHB1cnBvc2UgaWYgdGhpcyBzZXJ2aWNlIGlzIHRvIHByb2R1Y2UgYW4gYW5pbWF0aW9uIHNlcXVlbmNlIHByb2dyYW1tYXRpY2FsbHkgd2l0aGluIGFuXG4gKiBhbmd1bGFyIGNvbXBvbmVudCBvciBkaXJlY3RpdmUuXG4gKlxuICogUHJvZ3JhbW1hdGljIGFuaW1hdGlvbnMgYXJlIGZpcnN0IGJ1aWx0IGFuZCB0aGVuIGEgcGxheWVyIGlzIGNyZWF0ZWQgd2hlbiB0aGUgYnVpbGQgYW5pbWF0aW9uIGlzXG4gKiBhdHRhY2hlZCB0byBhbiBlbGVtZW50LlxuICpcbiAqIGBgYHRzXG4gKiAvLyByZW1lbWJlciB0byBpbmNsdWRlIHRoZSBCcm93c2VyQW5pbWF0aW9uc01vZHVsZSBtb2R1bGUgZm9yIHRoaXMgdG8gd29yay4uLlxuICogaW1wb3J0IHtBbmltYXRpb25CdWlsZGVyfSBmcm9tICdAYW5ndWxhci9hbmltYXRpb25zJztcbiAqXG4gKiBjbGFzcyBNeUNtcCB7XG4gKiAgIGNvbnN0cnVjdG9yKHByaXZhdGUgX2J1aWxkZXI6IEFuaW1hdGlvbkJ1aWxkZXIpIHt9XG4gKlxuICogICBtYWtlQW5pbWF0aW9uKGVsZW1lbnQ6IGFueSkge1xuICogICAgIC8vIGZpcnN0IGJ1aWxkIHRoZSBhbmltYXRpb25cbiAqICAgICBjb25zdCBteUFuaW1hdGlvbiA9IHRoaXMuX2J1aWxkZXIuYnVpbGQoW1xuICogICAgICAgc3R5bGUoeyB3aWR0aDogMCB9KSxcbiAqICAgICAgIGFuaW1hdGUoMTAwMCwgc3R5bGUoeyB3aWR0aDogJzEwMHB4JyB9KSlcbiAqICAgICBdKTtcbiAqXG4gKiAgICAgLy8gdGhlbiBjcmVhdGUgYSBwbGF5ZXIgZnJvbSBpdFxuICogICAgIGNvbnN0IHBsYXllciA9IG15QW5pbWF0aW9uLmNyZWF0ZShlbGVtZW50KTtcbiAqXG4gKiAgICAgcGxheWVyLnBsYXkoKTtcbiAqICAgfVxuICogfVxuICogYGBgXG4gKlxuICogV2hlbiBhbiBhbmltYXRpb24gaXMgYnVpbHQgYW4gaW5zdGFuY2Ugb2Yge0BsaW5rIEFuaW1hdGlvbkZhY3RvcnkgQW5pbWF0aW9uRmFjdG9yeX0gd2lsbCBiZVxuICogcmV0dXJuZWQuIFVzaW5nIHRoYXQgYW4ge0BsaW5rIEFuaW1hdGlvblBsYXllciBBbmltYXRpb25QbGF5ZXJ9IGNhbiBiZSBjcmVhdGVkIHdoaWNoIGNhbiB0aGVuIGJlXG4gKiB1c2VkIHRvIHN0YXJ0IHRoZSBhbmltYXRpb24uXG4gKlxuICogQGV4cGVyaW1lbnRhbCBBbmltYXRpb24gc3VwcG9ydCBpcyBleHBlcmltZW50YWwuXG4gKi9cbmV4cG9ydCBhYnN0cmFjdCBjbGFzcyBBbmltYXRpb25CdWlsZGVyIHtcbiAgYWJzdHJhY3QgYnVpbGQoYW5pbWF0aW9uOiBBbmltYXRpb25NZXRhZGF0YXxBbmltYXRpb25NZXRhZGF0YVtdKTogQW5pbWF0aW9uRmFjdG9yeTtcbn1cblxuLyoqXG4gKiBBbiBpbnN0YW5jZSBvZiBgQW5pbWF0aW9uRmFjdG9yeWAgaXMgcmV0dXJuZWQgZnJvbSB7QGxpbmsgQW5pbWF0aW9uQnVpbGRlciNidWlsZFxuICogQW5pbWF0aW9uQnVpbGRlci5idWlsZH0uXG4gKlxuICogQGV4cGVyaW1lbnRhbCBBbmltYXRpb24gc3VwcG9ydCBpcyBleHBlcmltZW50YWwuXG4gKi9cbmV4cG9ydCBhYnN0cmFjdCBjbGFzcyBBbmltYXRpb25GYWN0b3J5IHtcbiAgYWJzdHJhY3QgY3JlYXRlKGVsZW1lbnQ6IGFueSwgb3B0aW9ucz86IEFuaW1hdGlvbk9wdGlvbnMpOiBBbmltYXRpb25QbGF5ZXI7XG59XG4iXX0=