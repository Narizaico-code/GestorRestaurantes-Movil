import { useCallback, useState } from 'react';

import { notify } from '../../../shared/utils/confirm';

// Controla el estado del modal de reseña (crear o editar) y decide a qué acción
// del hook useReviews despachar el submit. Centraliza esta lógica para no
// duplicarla en cada pantalla que muestre reseñas (restaurante, platillo).
export function useReviewFormController({ createReview, updateReview }) {
  const [state, setState] = useState({ visible: false, review: null });

  const openCreate = useCallback(() => setState({ visible: true, review: null }), []);
  const openEdit = useCallback((review) => setState({ visible: true, review }), []);
  const close = useCallback(() => setState({ visible: false, review: null }), []);

  const onSubmit = useCallback(
    async ({ rating, comment, userName }) => {
      const result = state.review
        ? await updateReview(state.review.id, { rating, comment, userName })
        : await createReview({ rating, comment, userName });
      if (!result.ok) {
        notify('Error', result.error);
        return;
      }
      close();
      notify('¡Gracias!', state.review ? 'Tu reseña fue actualizada.' : 'Tu reseña fue publicada.');
    },
    [state.review, createReview, updateReview, close]
  );

  const initialValues = state.review
    ? { rating: state.review.rating, comment: state.review.comment, userName: state.review.userName }
    : null;

  return { visible: state.visible, initialValues, openCreate, openEdit, close, onSubmit };
}
