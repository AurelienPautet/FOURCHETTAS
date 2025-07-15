function DeleteModal({
  id,
  title,
  description,
  onDelete,
}: {
  id: string;
  title: string;
  description: string;
  onDelete: () => void;
}) {
  return (
    <>
      <dialog id={`my_modal_${id}`} className="modal">
        <div className="modal-box">
          <h3 className="font-bold text-lg">{title}</h3>
          <p className="py-4">{description}</p>
          <div className="modal-action">
            <form method="dialog" className="flex gap-2 w-full justify-center">
              <button className="btn btn-warning" onClick={onDelete}>
                Supprimer
              </button>
              <button className="btn">Annuler</button>
            </form>
          </div>
        </div>
      </dialog>
    </>
  );
}

export default DeleteModal;
