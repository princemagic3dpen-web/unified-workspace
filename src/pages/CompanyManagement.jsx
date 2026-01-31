import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Building2, Users, FolderKanban, Plus, Search } from 'lucide-react';
import { toast } from 'sonner';

export default function CompanyManagement() {
  const queryClient = useQueryClient();
  const [searchQuery, setSearchQuery] = useState('');

  const { data: companies = [] } = useQuery({
    queryKey: ['companies'],
    queryFn: () => base44.entities.Company.list('name')
  });

  const { data: projects = [] } = useQuery({
    queryKey: ['projects'],
    queryFn: () => base44.entities.Project.list('-created_date')
  });

  const { data: employees = [] } = useQuery({
    queryKey: ['employees'],
    queryFn: () => base44.entities.Employee.list('full_name')
  });

  const createCompany = useMutation({
    mutationFn: (data) => base44.entities.Company.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['companies'] });
      toast.success('Entreprise créée');
    }
  });

  const handleQuickCreate = async () => {
    const companyName = prompt('Nom de l\'entreprise:');
    if (!companyName) return;

    const company = await createCompany.mutateAsync({
      name: companyName,
      size: 'small',
      industry: 'Technologie'
    });

    // Créer dossier entreprise automatiquement
    await base44.entities.Folder.create({
      name: companyName,
      color: '#3b82f6',
      parent_id: null
    });

    toast.success(`Entreprise "${companyName}" créée avec dossier`);
  };

  const filteredCompanies = companies.filter(c =>
    c.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="h-full bg-gradient-to-br from-slate-900/95 via-blue-900/95 to-slate-900/95 backdrop-blur-xl p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500">
              <Building2 className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">Gestion Entreprises</h1>
              <p className="text-slate-400 text-sm">{companies.length} entreprises, {projects.length} projets, {employees.length} employés</p>
            </div>
          </div>
          <Button onClick={handleQuickCreate} className="bg-blue-600 hover:bg-blue-700">
            <Plus className="w-4 h-4 mr-2" />
            Nouvelle Entreprise
          </Button>
        </div>

        {/* Search */}
        <div className="relative mb-6">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Rechercher entreprises, projets, employés..."
            className="pl-10 bg-slate-800/50 backdrop-blur-sm border-slate-700 text-white"
          />
        </div>

        {/* Companies Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredCompanies.map(company => {
            const companyProjects = projects.filter(p => p.company_id === company.id);
            const companyEmployees = employees.filter(e => e.company_id === company.id);

            return (
              <Card key={company.id} className="bg-slate-800/50 backdrop-blur-sm border-slate-700/50 p-6 hover:bg-slate-800/70 transition-all">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-white">{company.name}</h3>
                    <p className="text-sm text-slate-400">{company.industry || 'Industrie non spécifiée'}</p>
                  </div>
                  <div className={`px-2 py-1 rounded text-xs ${
                    company.size === 'startup' ? 'bg-green-500/20 text-green-400' :
                    company.size === 'small' ? 'bg-blue-500/20 text-blue-400' :
                    company.size === 'medium' ? 'bg-purple-500/20 text-purple-400' :
                    'bg-orange-500/20 text-orange-400'
                  }`}>
                    {company.size}
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm text-slate-300">
                    <Users className="w-4 h-4 text-blue-400" />
                    <span>{companyEmployees.length} employés</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-slate-300">
                    <FolderKanban className="w-4 h-4 text-purple-400" />
                    <span>{companyProjects.length} projets</span>
                  </div>
                </div>

                <Button variant="outline" className="w-full mt-4 border-slate-700 hover:bg-slate-700">
                  Voir détails
                </Button>
              </Card>
            );
          })}
        </div>

        {filteredCompanies.length === 0 && (
          <div className="text-center py-12">
            <Building2 className="w-16 h-16 text-slate-600 mx-auto mb-4" />
            <p className="text-slate-400">Aucune entreprise trouvée</p>
          </div>
        )}
      </div>
    </div>
  );
}