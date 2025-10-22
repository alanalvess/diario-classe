import {Checkbox, Dropdown, Label} from "flowbite-react";

export default function MultiSelectDropdown({titulo, opcoes, selecionados, setSelecionados}) {
  const toggle = (id: number) => {
    setSelecionados(prev =>
      prev.includes(id) ? prev.filter((v) => v !== id) : [...prev, id]
    );
  };

  return (
    <>
      <div className="flex flex-col gap-2 w-full">
        <div className="relative w-full">
          <Dropdown
            label={
              <div className="flex justify-between items-center w-full text-gray-700 dark:text-gray-200">
                <span>
                  {selecionados.length > 0
                    ? `${selecionados.length} selecionado${selecionados.length > 1 ? "s" : ""}`
                    : `${titulo}`
                  }
                </span>
              </div>
            }
            color="light"
            className="w-full"
          >
            <div className="p-2">
              {opcoes.map((opt) => (
                <div key={opt.id} className="flex items-center gap-2">
                  <Checkbox
                    color="info"
                    className="focus:ring-0 dark:ring-offset-0 dark:focus:ring-0 focus:ring-offset-0 focus:outline-none"
                    id={`opt-${opt.id}`}
                    checked={selecionados.includes(opt.id)}
                    onChange={() => toggle(opt.id)}
                  />
                  <Label htmlFor={`opt-${opt.id}`} className="text-sm cursor-pointer">
                    {opt.nome}
                  </Label>
                </div>
              ))}
            </div>
          </Dropdown>
        </div>
      </div>
    </>
  );
}
