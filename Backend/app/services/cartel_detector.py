"""
Graph Network Collusion & Contractor Cartel Analyzer
Builds bipartite vendor-project graphs to uncover bidding rings and local monopolies.
"""
import networkx as nx
from typing import List, Dict, Any
from app.models.schemas import CartelNode, CartelEdge, CartelMatrixResponse
from app.core.config import settings

class CartelDetectorEngine:
    @staticmethod
    def analyze_district_cartels(district: str, projects_data: List[Dict[str, Any]]) -> CartelMatrixResponse:
        """
        Constructs a Bipartite Graph G(V_vendor, V_project) and analyzes degree centrality & tender concentration.
        """
        G = nx.Graph()
        vendor_totals = {}
        vendor_project_counts = {}
        district_total_funds = 0.0
        
        nodes: List[CartelNode] = []
        edges: List[CartelEdge] = []
        
        for p in projects_data:
            p_id = p["project_id"]
            p_title = p["title"]
            v_id = p["contractor_id"]
            v_name = p["contractor_name"]
            amount = float(p["sanctioned_amount"])
            
            district_total_funds += amount
            vendor_totals[v_id] = vendor_totals.get(v_id, 0.0) + amount
            vendor_project_counts[v_id] = vendor_project_counts.get(v_id, 0) + 1
            
            # Add Project Node
            G.add_node(p_id, node_type="project", label=p_title, amount=amount)
            # Add Vendor Node
            G.add_node(v_id, node_type="vendor", label=v_name)
            # Add Edge (Contract Award)
            G.add_edge(v_id, p_id, amount=amount, tender_id=f"TND-{p_id}")
            
            edges.append(CartelEdge(
                source=v_id,
                target=p_id,
                amount=amount,
                tender_id=f"TND-{p_id}"
            ))

        monopoly_vendors = []
        monopoly_vendor_ids = set()
        for v_id, total in vendor_totals.items():
            market_share = (total / district_total_funds) if district_total_funds > 0 else 0.0
            # A single-project district cannot establish a meaningful monopoly.
            is_monopoly = (vendor_project_counts[v_id] >= 2 and market_share >= settings.VENDOR_MONOPOLY_CONCENTRATION_LIMIT)
            if is_monopoly:
                monopoly_vendor_ids.add(v_id)
            
            v_name = next((p["contractor_name"] for p in projects_data if p["contractor_id"] == v_id), v_id)
            
            nodes.append(CartelNode(
                id=v_id,
                label=v_name,
                type="vendor",
                risk_level="CRITICAL" if is_monopoly else "LOW",
                total_amount=total
            ))
            
            if is_monopoly:
                monopoly_vendors.append({
                    "vendor_id": v_id,
                    "vendor_name": v_name,
                    "district_tender_share_pct": round(market_share * 100, 2),
                    "total_funds_captured_inr": total,
                    "alert": f"Vendor controls {market_share*100:.1f}% of all sanctioned funds in {district}."
                })
                
        # Append project nodes
        for p in projects_data:
            nodes.append(CartelNode(
                id=p["project_id"],
                label=p["title"],
                type="project",
                risk_level="MEDIUM" if p["contractor_id"] in monopoly_vendor_ids else "LOW",
                total_amount=float(p["sanctioned_amount"])
            ))

        return CartelMatrixResponse(
            district=district,
            nodes=nodes,
            edges=edges,
            monopoly_vendors=monopoly_vendors,
            flagged_clusters=[{
                "cluster_name": f"{district} Primary Infrastructure Cluster",
                "vendor_count": len(vendor_totals),
                "project_count": len(projects_data),
                "collusion_risk_index": "HIGH" if len(monopoly_vendors) > 0 else "NORMAL"
            }]
        )

cartel_detector_service = CartelDetectorEngine()
